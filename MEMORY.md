# MEMORY.md — Long-term memory

- Created: 2026-02-22T03:47:00+09:00


## Notes

- This file is the long-term memory index. Use it to store important, durable facts and decisions.
- If you want me to merge daily notes into this file, ask and I will create a recovery draft for review.


## Bootstrap / Obsidian memory (2026-03-03)
- Created a stable bootstrap context file: `memory/bootstrap-context.md`.
- Obsidian Vault (current) at `/Users/jamie/Library/Mobile Documents/iCloud~md~obsidian/Documents/work` (previously `/Users/jamie/Documents/Obsidian Vault`).
- Added Obsidian note: `OpenClaw/00 - 부팅컨텍스트 (Jarvis).md` as the human-readable bootstrap.

## Memory preference (2026-03-06)
- 사용자는 **완전 자동 기록(강함)**을 선호: 제가 수행한 작업은 기본적으로 전부 `memory/YYYY-MM-DD.md`에 시간순으로 남김.
- 메모 비대화 방지책: 기록이 길어지면 동일 파일 상단에 **핵심 요약(5~10줄)**을 주기적으로 갱신.
- 재사용 가치가 큰 설정/구조 변화는 Obsidian 부팅컨텍스트(`OpenClaw/00 - 부팅컨텍스트 (Jarvis).md`)에도 요약 반영.

## Remote dashboard access (2026-03-07)
- 권장 원격 접속: Gateway는 loopback 유지 + Tailscale + SSH 로컬포트포워딩으로 Control UI/WebChat 접속.
- 토큰 인증이 꼬이거나 잠기면 `openclaw dashboard --no-open`로 tokenized URL을 재발급해서 접속.

## OpenClaw 장애 분석 메모 (2026-03-13)
- 2026-03-12 심야의 Telegram 무응답은 기능 코드 자체보다 런타임 문제 가능성이 높았음.
- 가장 먼저 볼 것: `~/.openclaw/logs/gateway.err.log` 의 `openai-codex` OAuth 오류(`token_expired`, `refresh_token_reused`)와 `~/.openclaw/logs/gateway.log` 의 Gateway `SIGTERM`/restart 흔적.
- 인증 실패 + Gateway 재시작이 겹치면 메인 세션에서 응답 누락, orphaned user message 정리, lane wait exceeded, timeout이 연쇄적으로 나타날 수 있음.
