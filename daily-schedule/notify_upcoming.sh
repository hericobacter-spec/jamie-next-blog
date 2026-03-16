#!/usr/bin/env bash
set -euo pipefail
# Notify 15 minutes before events. Intended to run every minute.
ENV_FILE="/Users/jamie/.openclaw/workspace/daily-korean-news/.env"
if [ -f "$ENV_FILE" ]; then
  set -a; source "$ENV_FILE"; set +a
fi
if [ -z "${TELEGRAM_BOT_TOKEN-}" ] || [ -z "${TELEGRAM_CHAT_ID-}" ]; then
  echo "TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID must be set in $ENV_FILE" >&2
  exit 2
fi
ICAL=$(command -v icalbuddy || true)
if [ -z "$ICAL" ]; then
  ICAL=/opt/homebrew/bin/icalbuddy
fi
if [ ! -x "$ICAL" ]; then
  echo "ical-buddy not found" >&2
  exit 3
fi
# compute target window: events starting between 15 and 16 minutes from now
NOW=$(date +%s)
TARGET_START=$((NOW + 15*60))
TARGET_END=$((NOW + 16*60))
# format to yyyy-mm-dd HH:MM
start_str=$(date -u -r $TARGET_START +"%Y-%m-%d %H:%M:%S")
end_str=$(date -u -r $TARGET_END +"%Y-%m-%d %H:%M:%S")
# ical-buddy doesn't support direct epoch ranges, so query next 20 events and filter
RAW=$($ICAL --includeEventProps "title,datetime,location,calendar" eventsFrom:now to:now+1d 2>/dev/null || true)
if [ -z "$RAW" ]; then
  exit 0
fi
# parse events: ical-buddy outputs blocks like:\n• Title (Calendar)\n    YYYY. M. D. H:MM - H:MM\n    Location
# We'll search for lines with date/time and convert to epoch for comparison
# Create temp files
TMP=$(mktemp)
echo "$RAW" > "$TMP"
# Extract events: assume each event block has a title line and a datetime line
awk 'BEGIN{RS="\n\n"} {print $0 "\n---"}' "$TMP" > "$TMP.blocks"
SENT_LOG="/tmp/daily-schedule-sent.log"
mkdir -p "$(dirname "$SENT_LOG")"
touch "$SENT_LOG"
while IFS= read -r block; do
  title=$(echo "$block" | sed -n '1p' | sed 's/^[[:space:]]*•[[:space:]]*//')
  # find a line with digits and colon for time
  dtline=$(echo "$block" | grep -E '[0-9]{4}.' || true)
  if [ -z "$dtline" ]; then
    continue
  fi
  # try to parse a datetime like: 2026. 2. 24. 14:00 - 15:30  OR 2026. 2. 24.
  # We'll transform dots to dashes and attempt to extract start datetime
  # Replace dots and multiple spaces
  dtline_clean=$(echo "$dtline" | tr '.' '-' | sed 's/\s\+/ /g' | sed 's/- /-/g')
  # Attempt to find HH:MM in the line
  timepart=$(echo "$dtline_clean" | grep -oE '[0-9]{1,2}:[0-9]{2}' | head -n1 || true)
  datepart=$(echo "$dtline_clean" | sed -E 's/.*([0-9]{4}-[0-9]{1,2}-[0-9]{1,2}).*/\1/')
  if [ -z "$datepart" ] || [ -z "$timepart" ]; then
    continue
  fi
  # Build ISO string in local timezone
  iso_local="$datepart $timepart"
  # Convert to epoch (local) using date -j -f if available, fallback to python
  epoch=$(python3 - <<PY
import sys
import time
from datetime import datetime
s='''$iso_local'''
try:
    dt=datetime.strptime(s.strip(), '%Y-%m-%d %H:%M')
except Exception:
    try:
        dt=datetime.strptime(s.strip(), '%Y-%m-%d %H:%M:%S')
    except Exception:
        print('0')
        sys.exit(0)
import os
# assume local timezone
epoch=int(dt.replace().timestamp())
print(epoch)
PY
)
  if [ "$epoch" -eq 0 ]; then
    continue
  fi
  if [ $epoch -ge $TARGET_START ] && [ $epoch -le $TARGET_END ]; then
    idhash=$(echo "$title|$iso_local" | md5)
    if grep -qx "$idhash" "$SENT_LOG"; then
      continue
    fi
    # send telegram notification
    short_msg="[곧 시작] ${title}\n시간: ${iso_local}\n장소: $(echo "$block" | sed -n '3p' || echo '')"
    curl -sS -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" -d chat_id="$TELEGRAM_CHAT_ID" -d text="$short_msg" >/dev/null
    echo "$idhash" >> "$SENT_LOG"
  fi
done < "$TMP.blocks"
rm -f "$TMP" "$TMP.blocks"
exit 0
