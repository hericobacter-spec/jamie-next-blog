#!/usr/bin/env bash
set -euo pipefail
# Hourly activity reporter (weekdays 09:00-23:00) — improved format
ENV_FILE="/Users/jamie/.openclaw/workspace/daily-korean-news/.env"
if [ -f "$ENV_FILE" ]; then
  set -a; source "$ENV_FILE"; set +a
fi
TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN-}
TELEGRAM_CHAT_ID=${TELEGRAM_CHAT_ID-}
if [ -z "$TELEGRAM_BOT_TOKEN" ] || [ -z "$TELEGRAM_CHAT_ID" ]; then
  echo "TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID must be set in $ENV_FILE" >&2
  exit 0
fi
# Only run on weekdays and between 09:00 and 23:00
WDAY=$(date +%u) # 1..7 (Mon..Sun)
HOUR=$(date +%H)
if [ "$WDAY" -gt 5 ]; then
  exit 0
fi
if [ "$HOUR" -lt 9 ] || [ "$HOUR" -gt 23 ]; then
  exit 0
fi
NOW="$(date '+%Y-%m-%d %H:%M')"
REPORT="[활동 보고] ${NOW}\n\n"

# 1) Recent key items from MEMORY.md (take meaningful sections if available)
MEM_FILE="/Users/jamie/.openclaw/workspace/MEMORY.md"
if [ -f "$MEM_FILE" ]; then
  REPORT+="최근 요약:\n"
  # prefer the 'Notes' or last non-empty paragraphs; fallback to last 40 lines
  NOTES=$(awk '/## Notes/{flag=1;next}/##/{if(flag) exit}flag' "$MEM_FILE" | sed -n '1,120p' || true)
  if [ -n "$NOTES" ]; then
    REPORT+="$NOTES\n\n"
  else
    REPORT+=$(tail -n 40 "$MEM_FILE" | sed ':a;N;$!ba;s/\n/\n/g')
    REPORT+="\n\n"
  fi
fi

# 2) Today's memory highlights (if exists)
TODAY_FILE="/Users/jamie/.openclaw/workspace/memory/$(date +%Y-%m-%d).md"
if [ -f "$TODAY_FILE" ]; then
  REPORT+="오늘 하이라이트:\n"
  REPORT+=$(sed -n '1,120p' "$TODAY_FILE" | sed ':a;N;$!ba;s/\n/\n/g')
  REPORT+="\n\n"
fi

# 3) Upcoming or recently added calendar items (try to extract from today's memory file or MEMORY.md)
REPORT+="캘린더(최근 추가/예정):\n"
# Search memory files for date-like calendar entries (YYYY- or patterns) and list matches for next 7 days
grep -E "20[0-9]{2}-[0-9]{2}-[0-9]{2}|[0-9]{4}[-/]?[0-9]{2}[-/]?[0-9]{2}|[0-9]{1,2}/[0-9]{1,2}" /Users/jamie/.openclaw/workspace/memory/*.md 2>/dev/null | sed -n '1,40p' || true
CAL_MATCHES=$(grep -E "2026-[0-9]{2}-[0-9]{2}|[0-9]{1,2}월 [0-9]{1,2}일|QMS|회의|Webex" /Users/jamie/.openclaw/workspace/memory/*.md 2>/dev/null | sed -n '1,200p' || true)
if [ -n "$CAL_MATCHES" ]; then
  REPORT+="$CAL_MATCHES\n\n"
else
  REPORT+="(메모에 등록된 캘린더 항목 없음 — 로컬 캘린더 권한 필요 시 알려 주세요)\n\n"
fi

# 4) Recent workspace file changes (last 48 hours) — show file and mtime
REPORT+="최근 작업 파일(48h):\n"
find /Users/jamie/.openclaw/workspace -type f -mtime -2 -printf '%TY-%Tm-%Td %TH:%TM %p\n' 2>/dev/null | sort -r | sed -n '1,40p' || true
REPORT+="\n\n"

# 5) Important running services / monitors summary (quick)
REPORT+="시스템 모니터 요약:\n"
# include last system monitor snapshot if available
if [ -f "/tmp/system-monitor.out" ]; then
  tail -n 20 /tmp/system-monitor.out | sed -n '1,120p'
  REPORT+="\n\n"
else
  REPORT+="(system-monitor 로그 없음)\n\n"
fi

# Trim report if too long
MAX=3500
if [ ${#REPORT} -gt $MAX ]; then
  REPORT=${REPORT:0:$MAX}
  REPORT+="\n(중략)"
fi

# Send via Telegram
curl -sS -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" -d chat_id="$TELEGRAM_CHAT_ID" -d text="$REPORT" >/dev/null || true
exit 0
