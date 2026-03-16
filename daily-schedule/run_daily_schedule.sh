#!/usr/bin/env bash
set -euo pipefail
# Daily schedule briefing (runs at 08:00 KST)
# Loads environment from daily-korean-news .env (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID)
ENV_FILE="/Users/jamie/.openclaw/workspace/daily-korean-news/.env"
if [ -f "$ENV_FILE" ]; then
  # load env reliably
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi
if [ -z "${TELEGRAM_BOT_TOKEN-}" ] || [ -z "${TELEGRAM_CHAT_ID-}" ]; then
  echo "TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID must be set in $ENV_FILE" >&2
  exit 2
fi

# Helper to read Apple Calendar using icalBuddy; fallback to osascript
readonly ICAL="/opt/homebrew/bin/icalbuddy"
calendar_read() {
  local start="$1"; local end="$2"
  # Prefer icalBuddy if available
  if [ -x "$ICAL" ]; then
    # use eventsFrom:START to:END
    # ensure proper quoting
    out=$($ICAL "eventsFrom:$start" "to:$end" 2>/dev/null || true)
    if [ -n "$out" ]; then
      printf "%s" "$out"
      return 0
    fi
  fi
  # Fallback to AppleScript (osascript)
  python3 - <<'PY'
import subprocess,datetime
start_str = '$start'
end_str = '$end'
# use osascript to query Calendar
script = '''
set startDate to date "%s"
set endDate to date "%s"
set outLines to {}

tell application "Calendar"
    repeat with cal in calendars
        set calName to name of cal
        try
            set evs to (every event of cal whose start date ≥ startDate and start date ≤ endDate)
        on error
            set evs to {}
        end try
        repeat with e in evs
            set sDate to start date of e
            set sStr to (sDate as string)
            set tStr to summary of e
            set loc to location of e
            if loc is missing value then set loc to ""
            set end of outLines to (calName & "||" & sStr & "||" & tStr & "||" & loc)
        end repeat
    end repeat
end tell
if (count of outLines) is 0 then
    return "[알림] 일정이 없습니다."
else
    set AppleScript's text item delimiters to "\n"
    set joined to outLines as string
    return joined
end if
'''
proc = subprocess.run(['osascript','-e', script % (start_str, end_str)], capture_output=True, text=True)
print(proc.stdout.strip())
PY
}

MODE="${1:-}"
TODAY=$(date +%Y-%m-%d)
if [ "$MODE" = "--send-tomorrow" ]; then
  START_DATE=$(date -v+1d +%Y-%m-%d)
  END_DATE=$(date -v+2d +%Y-%m-%d)
  WINDOW_DAYS=1
else
  START_DATE="$TODAY"
  END_DATE=$(date -v+7d +%Y-%m-%d)
  WINDOW_DAYS=7
fi

# Primary read: icalBuddy strict date window (all calendars)
RAW=""
if [ -x "$ICAL" ]; then
  RAW=$($ICAL "eventsFrom:$START_DATE" "to:$END_DATE" 2>/dev/null || true)
fi
# Fallback read
if [ -z "$RAW" ]; then
  RAW=$(calendar_read "$START_DATE" "$END_DATE" || true)
fi
# Always keep raw dump for debugging
RAW_DUMP="/tmp/ical_$(date +%Y%m%d)_raw.txt"
printf "%s\n" "$RAW" > "$RAW_DUMP"
echo "raw_dump=$RAW_DUMP" >&2

# Check notification settings
SETTINGS_FILE="/Users/jamie/.openclaw/workspace/daily-schedule/settings.json"
NOTIFY_MODE="all"
if [ -f "$SETTINGS_FILE" ]; then
  # read JSON safely using python
  NOTIFY_MODE=$(python3 - <<PY
import json
try:
  s=json.load(open('$SETTINGS_FILE'))
  v=s.get(str($TELEGRAM_CHAT_ID),'all')
  print(v)
except Exception:
  print('all')
PY
)
fi
if [ "$NOTIFY_MODE" = "off" ]; then
  echo "Notifications disabled for chat ${TELEGRAM_CHAT_ID}. Exiting."
  exit 0
fi

# Build message in final fixed format (per user rules)
# We'll produce: header + date groups where each line is:
# • HH:MM–HH:MM Title [emoji] Location  (no labels, no emails)

# Reuse RAW built earlier
MSG="*📅 다음 7일 일정 요약*\n"
# we'll call a helper python to parse RAW robustly and print final text
PY_OUT=$(RAW="$RAW" WINDOW_DAYS="$WINDOW_DAYS" START_DATE="$START_DATE" /usr/bin/env python3 - <<'PY'
import sys,os,re,datetime
raw = os.environ.get('RAW','')
window_days = int(os.environ.get('WINDOW_DAYS','7'))
start_date = datetime.datetime.strptime(os.environ.get('START_DATE'), '%Y-%m-%d').date()
# parse blocks (supports both icalBuddy bullet format and calendar_read.py "||" format)
items=[]
lines=[ln.rstrip('\n') for ln in raw.splitlines() if ln.strip()]
blocks=[]
cur=[]
for ln in lines:
    if ln.startswith('• '):
        if cur:
            blocks.append(cur)
        cur=[ln]
    else:
        if cur:
            cur.append(ln)
        else:
            # could be || flat line
            blocks.append([ln])
if cur:
    blocks.append(cur)

def conv(a,t):
    hh,mm = map(int, t.split(':'))
    if a == '오후' and hh < 12: hh += 12
    if a == '오전' and hh == 12: hh = 0
    return f"{hh:02d}:{mm:02d}"

for b in blocks:
    title=''; loc=''; date=None; start=''; end=''
    first=b[0].strip()
    if '||' in first:
        parts = first.split('||')
        if len(parts) >= 4:
            date_str = parts[1].strip()
            title = parts[2].strip()
            loc = parts[3].strip()
            m = re.search(r"(\d{4})\D+(\d{1,2})\D+(\d{1,2})", date_str)
            if m:
                date = datetime.date(int(m.group(1)), int(m.group(2)), int(m.group(3)))
            # time
            rng = re.search(r'(오전|오후)?\s*(\d{1,2}:\d{2}).*[-–].*(오전|오후)?\s*(\d{1,2}:\d{2})', date_str)
            if rng:
                start = conv(rng.group(1) or '', rng.group(2))
                end = conv(rng.group(3) or '', rng.group(4))
    else:
        title = re.sub(r'^•\s*','',first)
        title = re.sub(r'\s*\([^)]*@[^)]*\)\s*$','',title).strip()
        body='\n'.join(b[1:])
        mloc = re.search(r'location:\s*(.+)', body, re.I)
        if mloc:
            loc = mloc.group(1).strip()
        text='\n'.join(b)
        if 'day after tomorrow' in text:
            date = datetime.date.today() + datetime.timedelta(days=2)
        elif 'tomorrow' in text or '내일' in text:
            date = datetime.date.today() + datetime.timedelta(days=1)
        elif 'today' in text or '오늘' in text:
            date = datetime.date.today()
        else:
            md = re.search(r'(\d{4})\D+(\d{1,2})\D+(\d{1,2})', text)
            if md:
                date = datetime.date(int(md.group(1)), int(md.group(2)), int(md.group(3)))
        rng = re.search(r'(오전|오후)?\s*(\d{1,2}:\d{2})\s*[-–]\s*(오전|오후)?\s*(\d{1,2}:\d{2})', text)
        if rng:
            start = conv(rng.group(1) or '', rng.group(2))
            end = conv(rng.group(3) or '', rng.group(4))

    if not date:
        continue
    if date < start_date or date >= (start_date + datetime.timedelta(days=window_days)):
        continue
    items.append({'date':date,'title':title,'start':start,'end':end,'loc':loc})
# group by date
from collections import defaultdict
out = defaultdict(list)
for it in items:
    if not it['date']:
        continue
    dkey = it['date'].strftime('%-m/%-d(%a)')
    # dedupe
    key = (it['title'], it['date'])
    if any(x[0]==it['title'] for x in out[dkey]):
        continue
    # choose icon (special-case: 삼일절 -> 🇰🇷)
    icon = ''
    title_lower = it['title'].lower()
    if '삼일' in it['title'] or '삼일절' in it['title'] or (it.get('loc','') and '대한민국의 휴일' in it.get('loc','')):
        icon = '🇰🇷'
    elif it['loc']:
        l = it['loc']
        if re.search(r'webex|zoom|teams', l, re.I): icon='💻'
        elif re.search(r'공임|정비|공장|공임나라', l, re.I): icon='🚗'
        else: icon='🏢'
    # build line
    if it['start'] and it['end']:
        times = f"{it['start']}–{it['end']}"
    elif it['start']:
        times = it['start']
    else:
        times = ''
    if it['loc']:
        line = f"• {times} {it['title']} {icon} {it['loc']}" if times else f"• {it['title']} {icon} {it['loc']}"
    else:
        # if icon is holiday flag and no loc, show emoji after bullet
        if icon and not it['loc']:
            line = f"• {icon} {it['title']}"
        else:
            line = f"• {times} {it['title']}" if times else f"• {it['title']}"
    out[dkey].append((it['title'], line))
# build final text
parts = []
parts.append('📅 내일 일정' if window_days == 1 else '📅 다음 7일 일정 요약')
for i in range(window_days):
    d = start_date + datetime.timedelta(days=i)
    dkey = d.strftime('%-m/%-d(%a)')
    parts.append(f"[{dkey}]")
    lines = out.get(dkey,[])
    if not lines:
        parts.append('• 일정 없음')
    for k,line in lines:
        parts.append(line)
print('\n'.join(parts))
PY
)

# send message payload safely via python json dump (preserve newlines)
PAYLOAD_FILE="/tmp/tg_payload_schedule.json"
PY_OUT="$PY_OUT" TELEGRAM_CHAT_ID="$TELEGRAM_CHAT_ID" python3 - <<'PY'
import json, os
payload = {
  "chat_id": os.environ["TELEGRAM_CHAT_ID"],
  "text": os.environ.get("PY_OUT", ""),
  "reply_markup": {
    "inline_keyboard": [[
      {"text": "전체 보기", "callback_data": "view_all"},
      {"text": "알림 설정", "callback_data": "notify_settings"}
    ]]
  }
}
with open('/tmp/tg_payload_schedule.json','w',encoding='utf-8') as f:
  json.dump(payload, f, ensure_ascii=False)
PY

API_URL="https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage"
curl -sS -X POST "$API_URL" -H 'Content-Type: application/json; charset=utf-8' -d @"$PAYLOAD_FILE" -w "\nHTTP_STATUS:%{http_code}\n" -o /tmp/tg_send_schedule.json || true
cat /tmp/tg_send_schedule.json || true
exit 0
