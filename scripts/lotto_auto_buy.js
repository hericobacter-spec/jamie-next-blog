#!/usr/bin/env node
/**
 * 동행복권 로또 6/45 자동(5게임) 구매 스크립트
 *
 * 사용 예시:
 *   node scripts/lotto_auto_buy.js --dry-run
 *   node scripts/lotto_auto_buy.js --buy
 *
 * 옵션:
 *   --buy        : 실제 '구매하기'까지 클릭
 *   --dry-run    : 구매 직전까지만 수행 (기본값)
 *   --headless   : 헤드리스 모드
 *   --profile=DIR: Playwright 프로필 경로 (로그인 세션 저장용)
 *
 * 주의:
 * - 최초 1회는 수동 로그인 필요 (프로필에 세션 저장)
 * - 이미 주간 5천원 구매 완료 시 구매가 차단될 수 있음
 */

const { chromium } = require('playwright');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
const willBuy = args.includes('--buy');
const dryRun = args.includes('--dry-run') || !willBuy;
const headless = args.includes('--headless');
const keepOpen = args.includes('--keep-open');

// Optional auth integration (recommended): macOS Keychain
// Store a generic password under service name (default: openclaw-dhlottery)
// and account name (e.g., auqas). Password is never logged.
const keychainService = (args.find(a => a.startsWith('--keychain-service='))?.split('=')[1]) || process.env.DHLOTTERY_KEYCHAIN_SERVICE || 'openclaw-dhlottery';
const accountArg = args.find(a => a.startsWith('--account='));
const dhlotteryAccount = (accountArg ? accountArg.split('=')[1] : null) || process.env.DHLOTTERY_ID || null;

const profileArg = args.find(a => a.startsWith('--profile='));
const userDataDir = profileArg
  ? profileArg.split('=')[1]
  : path.join(process.env.HOME || process.env.USERPROFILE, '.openclaw', 'playwright', 'dhlottery-profile');

const GAME_URL = 'https://ol.dhlottery.co.kr/olotto/game/game645.do';

function emitResult(status, extra = {}) {
  const payload = { status, ...extra };
  console.log('[LOTTO_RESULT] ' + JSON.stringify(payload, null, 0));
}

function textIncludes(page, text) {
  return page.locator(`text=${text}`).first().isVisible().catch(() => false);
}

function getPasswordFromKeychain(service, account) {
  if (!service || !account) return null;
  try {
    // -w prints only the password
    const pw = execSync(`security find-generic-password -s ${JSON.stringify(service)} -a ${JSON.stringify(account)} -w`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return pw || null;
  } catch (_) {
    return null;
  }
}

async function tryAutoLogin(page) {
  // Heuristics: if we see login UI or missing buy UI, attempt to log in.
  const needLogin = await textIncludes(page, '로그인');
  const hasBuyUI = await page.locator('#btnSelectNum, #amoundApply, input[name="checkAutoSelect"]').first().isVisible().catch(() => false);

  if (hasBuyUI && !needLogin) return { attempted: false, ok: true };

  const account = dhlotteryAccount || 'auqas'; // fallback to user's provided id
  const password = getPasswordFromKeychain(keychainService, account);
  if (!password) {
    return {
      attempted: true,
      ok: false,
      reason: `키체인 비밀번호를 찾지 못했습니다. (service="${keychainService}", account="${account}")`
    };
  }

  // Go to login page (new site path)
  await page.goto('https://www.dhlottery.co.kr/login', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});

  // Try selectors (site may change)
  // Prefer accessible names first (Korean labels)
  // Prefer stable IDs on current login page
  const idSel = page.locator('input#inpUserId, input[name="inpUserId"], input[placeholder="아이디"], input[aria-label="아이디"]').first();
  const pwSel = page.locator('input#inpUserPswdEncn, input[placeholder="비밀번호"], input[aria-label="비밀번호"], input[type="password"]').first();
  const loginBtn = page.locator('button:has-text("로그인"), input[type="submit"], a:has-text("로그인")').first();

  if (!(await idSel.isVisible().catch(() => false)) || !(await pwSel.isVisible().catch(() => false))) {
    return { attempted: true, ok: false, reason: '로그인 입력 필드를 찾지 못했습니다(페이지 구조 변경 가능).' };
  }

  await idSel.fill(account, { timeout: 5000 }).catch(() => {});
  await pwSel.fill(password, { timeout: 5000 }).catch(() => {});

  if (await loginBtn.isVisible().catch(() => false)) {
    await loginBtn.click({ timeout: 8000 }).catch(() => {});
  } else {
    // fallback: press Enter in password field
    await pwSel.press('Enter').catch(() => {});
  }

  await page.waitForTimeout(1200);

  // Return to game page
  await page.goto(GAME_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });

  const hasBuyUIAfter = await page.locator('#btnSelectNum, #amoundApply, input[name="checkAutoSelect"]').first().isVisible().catch(() => false);
  if (!hasBuyUIAfter) {
    return { attempted: true, ok: false, reason: '로그인 이후에도 구매 UI가 보이지 않습니다(추가 인증/정책 차단 가능).' };
  }

  return { attempted: true, ok: true };
}

async function closeIfVisible(page, rootSelector, closeText = '닫기') {
  const root = page.locator(rootSelector);
  if (await root.isVisible().catch(() => false)) {
    const closeBtn = root.locator(`text=${closeText}`).first();
    if (await closeBtn.isVisible().catch(() => false)) {
      await closeBtn.click({ timeout: 2000 }).catch(() => {});
      await page.waitForTimeout(300);
    }
  }
}

(async () => {
  const context = await chromium.launchPersistentContext(userDataDir, {
    channel: 'chrome',
    headless,
    viewport: { width: 1440, height: 1000 },
  });

  const page = context.pages()[0] || await context.newPage();

  try {
    await page.goto(GAME_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // 로그인 자동화(키체인 기반) 시도
    const loginResult = await tryAutoLogin(page);
    if (loginResult.attempted && !loginResult.ok) {
      console.log('로그인 필요 — 키체인 기반 자동로그인 실패');
      console.log(loginResult.reason);
      emitResult('login_required', { reason: loginResult.reason });
      await context.close();
      process.exit(2);
    }

    // 팝업(연금복권 추천/구매한도 안내 등) 닫기 시도
    await closeIfVisible(page, '#recommend720Plus', '닫기');
    await closeIfVisible(page, '#popupLayer', '닫기');
    await closeIfVisible(page, '#popupLayerAlert', '확인');

    // 1) 자동선택 체크
    const autoCheck = page.locator('input[name="checkAutoSelect"], #checkAutoSelect').first();
    if (await autoCheck.isVisible().catch(() => false)) {
      if (!(await autoCheck.isChecked().catch(() => false))) {
        // Some layouts place the checkbox outside viewport; use DOM-level toggle
        await autoCheck.evaluate(el => {
          el.checked = true;
          el.dispatchEvent(new Event('click', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        });
      }
    } else {
      throw new Error('자동선택 체크박스를 찾지 못했습니다.');
    }

    // 2) 적용수량 5 선택
    const qty = page.locator('#amoundApply, select[title="적용수량"]').first();
    await qty.selectOption('5');

    // 3) 확인 버튼
    const confirmBtn = page.locator('#btnSelectNum, button:has-text("확인")').first();
    await confirmBtn.click();

    // 반영 대기
    await page.waitForTimeout(800);

    // 상태 확인
    const amountText = (await page.locator('#payAmt').first().textContent().catch(() => ''))?.trim() || '';
    const assignedCount = await page.locator('[id^="selectGbn"]').evaluateAll(nodes =>
      nodes.filter(n => (n.textContent || '').trim() !== '미지정').length
    ).catch(() => 0);

    const weeklyLimitBlocked = await textIncludes(page, '이번 주 로또 구매한도 5천원을 모두 채우셨습니다.');

    console.log('[상태] 적용수량: 5, 자동선택: 체크 완료');
    console.log(`[상태] 선택 게임수: ${assignedCount}, 결제금액 텍스트: ${amountText || '(확인불가)'}`);

    if (weeklyLimitBlocked) {
      console.log('[차단] 이번 주 구매한도 도달로 보입니다. (예상된 상태)');
      emitResult('weekly_limit_reached', { phase: 'pre-buy' });
      await context.close();
      process.exit(3);
    }

    if (dryRun) {
      console.log('[DRY-RUN] 구매 직전까지 완료. 실제 구매는 실행하지 않았습니다.');
      emitResult('dry_run_ready', { assignedCount, amountText });
      if (keepOpen && !headless) {
        console.log('[KEEP-OPEN] 브라우저를 열어둡니다. 확인 후 창을 닫아주세요.');
        await page.waitForTimeout(10 * 60 * 1000);
      }
      await context.close();
      process.exit(0);
    }

    // 확인 다이얼로그는 클릭 시점에 뜰 수 있으므로 먼저 핸들러부터 설치
    page.once('dialog', async d => {
      try { await d.accept(); } catch (_) {}
    });

    // 4) 실제 구매 클릭
    const buyBtn = page.locator('#btnBuy, button:has-text("구매하기")').first();
    await buyBtn.click();

    // Give the confirm layer a moment to appear
    await page.waitForTimeout(500);

    // 확인 다이얼로그 처리(구매하시겠습니까?)
    // - 레이어/iframe/JS dialog 등 다양한 형태를 반복 시도

    async function clickConfirmOnce() {
      // 1) JS dialog (window.alert/confirm)
      // NOTE: handler already registered via page.once('dialog', ...)

      // 2) First try: find the dialog container that contains the confirm text
      const dialog = page.locator('div:has-text("구매하시겠습니까")').first();
      if (await dialog.isVisible().catch(() => false)) {
        // Prefer explicit input[value=확인] which is commonly used in this site
        const okInDialog = dialog.locator(
          'input[type="button"][value="확인"], button:has-text("확인"), a:has-text("확인"), input[type="button"][value="예"], button:has-text("예"), a:has-text("예")'
        ).first();
        if (await okInDialog.isVisible().catch(() => false)) {
          await okInDialog.click({ force: true }).catch(() => {});
          return true;
        }
      }

      // 3) Frame scan for the confirm text (fallback)
      async function clickConfirmInFrame(frame) {
        const hasText = frame.locator('text=구매하시겠습니까').first();
        if (!(await hasText.isVisible().catch(() => false))) return false;

        const okBtn = frame.locator(
          'input[type="button"][value="확인"], button:has-text("확인"), a:has-text("확인"), input[type="button"][value="예"], button:has-text("예"), a:has-text("예")'
        ).first();
        if (await okBtn.isVisible().catch(() => false)) {
          await okBtn.click({ force: true }).catch(() => {});
          return true;
        }
        return false;
      }

      for (const frame of page.frames()) {
        if (await clickConfirmInFrame(frame)) return true;
      }

      // 4) Layer-based confirm (fallback)
      const confirmLayer = page.locator('#popupLayerConfirm, .popup_confirm, .layer_confirm, .modal, .ui-dialog, [role="dialog"]').first();
      if (await confirmLayer.isVisible().catch(() => false)) {
        const yesBtn = confirmLayer.locator(
          'input[type="button"][value="확인"], button:has-text("확인"), a:has-text("확인"), input[type="button"][value="예"], button:has-text("예"), a:has-text("예")'
        ).first();
        if (await yesBtn.isVisible().catch(() => false)) {
          await yesBtn.click({ force: true }).catch(() => {});
          return true;
        }
      }

      return false;
    }

    // Try for up to ~5 seconds
    for (let i = 0; i < 10; i++) {
      const clicked = await clickConfirmOnce();
      const stillThere = await page.locator('text=구매하시겠습니까').first().isVisible().catch(() => false);
      if (clicked && !stillThere) break;
      await page.waitForTimeout(500);
    }

    // 결과 대기/판별
    // (구매 확인 후) 영수증 팝업/오류 문구가 뜰 시간을 조금 넉넉히 줌
    await page.waitForTimeout(4500);

    const buyError = await textIncludes(page, '구매시 오류가 발생하였습니다.');
    const weeklyLimitBlocked2 = await textIncludes(page, '이번 주 로또 구매한도 5천원을 모두 채우셨습니다.');

    // 구매 완료 판별: 영수증 팝업(제목: "구매내역 확인") + 메타(발행일/추첨일/지급기한) 조합
    const buyReceiptTitle = await textIncludes(page, '구매내역 확인');
    const buyReceiptMeta = (await textIncludes(page, '발 행 일')) || (await textIncludes(page, '추 첨 일')) || (await textIncludes(page, '지급기한'));
    const buyCompleteHint = buyReceiptTitle && buyReceiptMeta;

    if (weeklyLimitBlocked2) {
      console.log('[차단] 이번 주 구매한도(5천원) 도달로 보입니다.');
      emitResult('weekly_limit_reached', { phase: 'post-buy' });
      if (keepOpen && !headless) {
        console.log('[KEEP-OPEN] 브라우저를 열어둡니다. 메시지를 확인 후 닫아주세요.');
        await page.waitForTimeout(10 * 60 * 1000);
      }
      await context.close();
      process.exit(3);
    }

    if (buyError) {
      console.log('[결과] 구매 오류 또는 정책 제한으로 실패했습니다.');
      emitResult('buy_failed', { reason: 'buy_error_or_policy' });
      if (keepOpen && !headless) {
        console.log('[KEEP-OPEN] 브라우저를 열어둡니다. 오류 메시지를 확인 후 닫아주세요.');
        await page.waitForTimeout(10 * 60 * 1000);
      }
      await context.close();
      process.exit(4);
    }

    if (buyCompleteHint) {
      console.log('[결과] 구매 완료(영수증 팝업) 확인');
      emitResult('buy_success', { receiptDetected: true, assignedCount, amountText });

      // 영수증 팝업의 확인 버튼을 눌러 닫기(가능한 경우)
      await page.locator('div:has-text("구매내역 확인") input[type="button"][value="확인"], div:has-text("구매내역 확인") button:has-text("확인")').first().click({ force: true }).catch(() => {});

      if (keepOpen && !headless) {
        console.log('[KEEP-OPEN] 브라우저를 열어둡니다. 구매내역을 확인 후 닫아주세요.');
        await page.waitForTimeout(10 * 60 * 1000);
      }
      await context.close();
      process.exit(0);
    }

    console.log('[결과] 구매 결과를 명확히 판별하지 못했습니다. 화면을 확인하세요.');
    emitResult('result_unknown', { assignedCount, amountText });

    // Debug artifacts (no sensitive data should be visible; still avoid logging cookies)
    try {
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      const outPng = path.join(__dirname, '..', 'memory', `lotto-unknown-${ts}.png`);
      await page.screenshot({ path: outPng, fullPage: true });
      console.log(`[디버그] 스크린샷 저장: ${outPng}`);
    } catch (_) {}

    if (keepOpen && !headless) {
      console.log('[KEEP-OPEN] 브라우저를 10분간 열어둡니다. (팝업/오류/추가 인증 여부 확인)');
      try { await page.waitForTimeout(10 * 60 * 1000); } catch (_) {}
    }
    await context.close();
    process.exit(1);

  } catch (err) {
    console.error('[오류]', err.message);
    emitResult('script_error', { message: err.message });
    await context.close();
    process.exit(1);
  }
})();
