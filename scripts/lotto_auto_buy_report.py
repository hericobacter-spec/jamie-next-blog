#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

SCRIPT = "/Users/jamie/.openclaw/workspace/scripts/lotto_auto_buy.js"
ARGS = [
    "node", SCRIPT,
    "--buy",
    "--headless",
    "--profile=/Users/jamie/.openclaw/playwright/dhlottery-profile",
    "--account=auqas",
    "--keychain-service=openclaw-dhlottery",
]


def main() -> int:
    p = subprocess.run(ARGS, capture_output=True, text=True, timeout=240)
    out = (p.stdout or "")
    err = (p.stderr or "")
    combined = (out + "\n" + err).strip()

    result = None
    for line in combined.splitlines():
        line = line.strip()
        if line.startswith('[LOTTO_RESULT] '):
            payload = line[len('[LOTTO_RESULT] '):].strip()
            try:
                result = json.loads(payload)
            except Exception:
                pass

    status = (result or {}).get('status')

    if status == 'buy_success':
        print('[로또 자동구매] 구매 성공\n- 자동선택 5게임(₩5,000) 구매 완료로 판정되었습니다.\n- 영수증/구매내역 팝업 기준으로 성공 확인.')
        return 0

    if status == 'weekly_limit_reached':
        print('[로또 자동구매] 구매 미실행\n- 이번 주 구매한도(₩5,000) 도달 상태입니다.\n- 중복 구매는 발생하지 않은 것으로 봅니다.')
        return 0

    if status == 'login_required':
        reason = (result or {}).get('reason') or '키체인/접근허용 설정 확인 필요'
        print('[로또 자동구매] 로그인 필요\n- 키체인/접근허용 설정을 확인해주십시오.\n- 사유: ' + reason)
        return 0

    if status == 'buy_failed':
        reason = (result or {}).get('reason') or '구매 오류 또는 정책 제한'
        print('[로또 자동구매] 구매 실패\n- 동행복권 사이트에서 구매 오류 또는 정책 제한으로 판정되었습니다.\n- 사유: ' + reason)
        return 0

    if status == 'result_unknown':
        shot = ''
        m = re.search(r'\[디버그\] 스크린샷 저장: (.+)', combined)
        if m:
            shot = m.group(1).strip()
        msg = '[로또 자동구매] 확인 필요\n- 구매 결과를 명확히 판별하지 못했습니다.'
        if shot:
            msg += f'\n- 디버그 스크린샷 저장: {shot}'
        print(msg)
        return 0

    if status == 'script_error':
        reason = (result or {}).get('message') or '스크립트 오류'
        print('[로또 자동구매] 스크립트 오류\n- 자동구매 스크립트 실행 중 오류가 발생했습니다.\n- 사유: ' + reason)
        return 0

    if status == 'dry_run_ready':
        print('[로또 자동구매] 참고\n- 현재는 구매 직전 준비 상태로 판정되었습니다(dry-run).')
        return 0

    tail = '\n'.join([line for line in combined.splitlines() if line.strip()][-6:])
    print('[로또 자동구매] 확인 필요\n- 결과 태그를 읽지 못했습니다.\n- 최근 로그:\n' + (tail or '(로그 없음)'))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
