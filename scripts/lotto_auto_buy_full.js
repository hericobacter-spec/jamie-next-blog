#!/usr/bin/env node
/**
 * 로또6/45 자동구매(5게임, 자동선택) - 구매하기까지 수행
 * - 로그인 세션(크롬 저장) 전제
 * - 주간 한도/팝업 감지 시 중단
 */

const { spawn } = require('child_process');
const path = require('path');

const base = path.join(__dirname, 'lotto_auto_buy.js');
const args = [base, '--buy', ...process.argv.slice(2)];

const p = spawn(process.execPath, args, { stdio: 'inherit' });
p.on('exit', (code) => process.exit(code ?? 1));
