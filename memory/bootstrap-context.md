# Bootstrap Context (auto-generated)

Updated: 2026-03-06T22:58:01+09:00


## Quick pointers (source of truth)
- Obsidian Vault: `/Users/jamie/Library/Mobile Documents/iCloud~md~obsidian/Documents/work`
- Obsidian bootstrap: `/Users/jamie/Library/Mobile Documents/iCloud~md~obsidian/Documents/work/SmartHome/OpenClaw/00 - 부팅컨텍스트 (Jarvis).md`
- OpenClaw MEMORY.md: `/Users/jamie/.openclaw/workspace/MEMORY.md`
- Daily notes dir: `/Users/jamie/.openclaw/workspace/memory`


## Obsidian excerpts (curated)

### SmartHome/OpenClaw/00 - 부팅컨텍스트 (Jarvis).md

```md
# 00 - 부팅컨텍스트 (Jarvis)

> 목적: 모델이 바뀌거나 새 세션이 열려도, Jarvis가 **항상 먼저 읽고** 필요한 맥락을 복원하기 위한 최소 컨텍스트.

## 정본(소스 오브 트루스)
- Obsidian Vault: `/Users/jamie/Library/Mobile Documents/iCloud~md~obsidian/Documents/work`
- OpenClaw Memory:
  - Long-term: `/Users/jamie/.openclaw/workspace/MEMORY.md`
  - Daily: `/Users/jamie/.openclaw/workspace/memory/YYYY-MM-DD.md`

## OpenClaw 자동화 핵심 경로
- Workspace: `/Users/jamie/.openclaw/workspace`
- 일정 브리핑: `daily-schedule/run_daily_schedule.sh`
- 15분 전 알림: `daily-schedule/alert_dispatcher.py`
- 텔레그램 버튼/콜백(일정용): `daily-schedule/callback_poller.py`
- 데일리 뉴스: `daily-korean-news/run_daily_korean_news.sh`
- 텔레그램 .env: `daily-korean-news/.env`

## Home Assistant(HA) 텔레그램 패널/제어(중요)
- HA 연결정보는 OpenClaw 설정 env에 있음: `~/.openclaw/openclaw.json` → `env.vars.HA_BASE_URL`, `env.vars.HA_TOKEN`
- HA 제어 플러그인(로컬): `workspace/.openclaw/extensions/ha` (plugin id: `ha`)
- Telegram에서 쓸 명령(슬래시 커맨드):
  - `/ha toggle|on|off <entity_id>`
  - `/ha state <entity_id>` (climate는 mode+현재온도+목표온도 표시)
  - `/ha temp <climate_entity_id> <21-26>`
  - `/ha open|close <valve_entity_id>`
- 고정(pinned)용 버튼 패널은 텔레그램 DM에 최신 메시지를 고정해서 사용

## launchd (주요 LaunchAgents)
- Gateway: `~/Library/LaunchAgents/ai.openclaw.gateway.plist` (보통 127.0.0.1:18789)
- 사용자 작업: `~/Library/LaunchAgents/com.jamie.*.plist`

## NAS(SUPER) 경로
- `/Volumes/super`가 아니라, 다음 경로에 마운트됨:
  - `/Users/jamie/NetworkDrives/SUPER-personal_folder`
  - Monitor: `/Users/jamie/NetworkDrives/SUPER-personal_folder/Monitor`

## n8n 관련 (중요)
- n8n은 설치되어 있을 수 있으나, **워크플로우가 실제로 구성/활성화되어 있다고 가정하면 안 됨**
- 실제 동작 여부는 n8n UI/컨테이너 상태로 확인

## 운영 규칙
- 중요한 변경(업데이트/자동화 수정/권한 변경) 전에:
  1) 위 경로의 문서/메모리를 먼저 읽고
  2) 변경 전/후 차이를 기록하고
  3) 즉시 롤백 경로를 준비할 것

## 메모(기억) 운영 방식
- 기본: Jarvis가 수행한 작업은 **전부** `memory/YYYY-MM-DD.md`에 시간순 기록
- 기록이 길어지면 같은 파일 상단에 **핵심 요약(5~10줄)**을 주기적으로 갱신
```

## OpenClaw MEMORY.md (top excerpt)

```md
# MEMORY.md — Long-term memory

- Created: 2026-02-22T03:47:00+09:00


## Notes

- This file is the long-term memory index. Use it to store important, durable facts and decisions.
- If you want me to merge daily notes into this file, ask and I will create a recovery draft for review.


## Bootstrap / Obsidian memory (2026-03-03)
- Created a stable bootstrap context file: `memory/bootstrap-context.md`.
- Obsidian Vault discovered at `/Users/jamie/Documents/Obsidian Vault`.
- Added Obsidian note: `OpenClaw/00 - 부팅컨텍스트 (Jarvis).md` as the human-readable bootstrap.

## Memory preference (2026-03-06)
- 사용자는 **완전 자동 기록(강함)**을 선호: 제가 수행한 작업은 기본적으로 전부 `memory/YYYY-MM-DD.md`에 시간순으로 남김.
- 메모 비대화 방지책: 기록이 길어지면 동일 파일 상단에 **핵심 요약(5~10줄)**을 주기적으로 갱신.
- 재사용 가치가 큰 설정/구조 변화는 Obsidian 부팅컨텍스트(`OpenClaw/00 - 부팅컨텍스트 (Jarvis).md`)에도 요약 반영.
```

## Recent daily notes present
- 2026-03-06.md
- 2026-03-05.md

## Operational invariants
- NAS SUPER mounts under `~/NetworkDrives/*` (not `/Volumes/super`).
- For Telegram schedule/alerts, env is in `daily-korean-news/.env`.
- Gateway is loopback-only by default; typical port 18789.
