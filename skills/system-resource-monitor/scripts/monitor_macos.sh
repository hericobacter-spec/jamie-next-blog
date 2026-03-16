#!/usr/bin/env bash
set -uo pipefail
# macOS-compatible system resource monitor
# NOTE: For safety, this skill defaults to **no external notifications**.
# If you *explicitly* want Telegram alerts, set:
#   ENABLE_TELEGRAM_ALERTS=1
#   TELEGRAM_BOT_TOKEN=...
#   TELEGRAM_CHAT_ID=...
# optionally set ENV_FILE to source env vars.
# do not exit on non-fatal command failures; we handle errors explicitly
set +e

ENV_FILE=${ENV_FILE-}
if [ -n "$ENV_FILE" ] && [ -f "$ENV_FILE" ]; then
  set -a; source "$ENV_FILE"; set +a
fi

ENABLE_TELEGRAM_ALERTS=${ENABLE_TELEGRAM_ALERTS-0}
TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN-}
TELEGRAM_CHAT_ID=${TELEGRAM_CHAT_ID-}
# thresholds (tunable) — adjusted for lower alert noise (higher = fewer alerts)
LOAD_THRESHOLD=6.0
MEM_PCT_THRESHOLD=92
DISK_PCT_THRESHOLD=92
# debounce settings (seconds): suppress identical alerts for this period
DEBOUNCE_SECONDS=1800  # 30 minutes
STATE_DIR="/tmp/system-monitor-state"
mkdir -p "$STATE_DIR"

# helper to send an alert (default: stdout only)
_send() {
  local text="$1"
  if [ "$ENABLE_TELEGRAM_ALERTS" = "1" ] && [ -n "$TELEGRAM_BOT_TOKEN" ] && [ -n "$TELEGRAM_CHAT_ID" ]; then
    curl -sS -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
      -d chat_id="$TELEGRAM_CHAT_ID" \
      -d text="$text" >/dev/null || true
  else
    echo "$text"
  fi
}

# helper to check debounce: returns 0 if allowed to send, 1 if suppressed
_allow_send() {
  # arg: key
  local key="$1"
  local file="$STATE_DIR/${key}.last"
  if [ -f "$file" ]; then
    local last=$(cat "$file" 2>/dev/null || echo 0)
    local now=$(date +%s)
    if [ $((now - last)) -lt $DEBOUNCE_SECONDS ]; then
      return 1
    fi
  fi
  date +%s > "$file" 2>/dev/null || true
  return 0
}
# Uptime
UPTIME=$(uptime)
# Load avg: extract 1m
LOAD_1=$(echo "$UPTIME" | awk -F'load averages?: ' '{print $2}' | awk -F', ' '{print $1}' | tr -d ',')
# macOS older/newer variations
if [ -z "$LOAD_1" ]; then
  LOAD_1=$(uptime | awk -F'load average:' '{print $2}' | awk -F', ' '{print $1}' | tr -d ',') || true
fi
# Memory: use vm_stat to compute used%
# total mem in bytes
MEM_BYTES=$(/usr/sbin/sysctl -n hw.memsize 2>/dev/null || /usr/bin/sysctl -n hw.memsize 2>/dev/null || echo 0)
# page size and pages
PAGE_SIZE=$(/usr/sbin/sysctl -n hw.pagesize 2>/dev/null || /usr/bin/sysctl -n hw.pagesize 2>/dev/null || echo 4096)
FREE_PAGES=$(vm_stat | awk '/Pages free/ {print $3}' | tr -d '.')
INACTIVE_PAGES=$(vm_stat | awk '/Pages inactive/ {print $3}' | tr -d '.')
# free-ish bytes
FREE_BYTES=$(( (FREE_PAGES + INACTIVE_PAGES) * PAGE_SIZE ))
USED_PCT=$(( 100 - (FREE_BYTES * 100 / MEM_BYTES) ))
# Disk usage for /
DISK_LINE=$(df -h / | awk 'NR==2 {print $5 " " $4 " " $3}')
DISK_PCT=$(echo "$DISK_LINE" | awk '{print $1}' | tr -d '%')
DISK_FREE=$(echo "$DISK_LINE" | awk '{print $2}')
DISK_USED=$(echo "$DISK_LINE" | awk '{print $3}')
# Check gateway port
GATEWAY_OK=1
if lsof -iTCP:18792 -sTCP:LISTEN -n -P >/dev/null 2>&1; then
  GATEWAY_OK=0
fi
# Build summary (Korean, 사용자 친화적)
SUMMARY="[시스템 모니터] $(date '+%Y-%m-%d %H:%M:%S')\n업타임: $UPTIME\n부하(1분 평균): ${LOAD_1}\n메모리 사용률: ${USED_PCT}%\n디스크(/) 사용: ${DISK_USED}, 여유: ${DISK_FREE} (${DISK_PCT}% 사용)\n게이트웨이(127.0.0.1:18792) 수신 여부: $([ $GATEWAY_OK -eq 0 ] && echo '예' || echo '아니오')"
# Print summary to stdout
echo -e "$SUMMARY"
# Alerts
ALERTS=()
# load compare (float)
awk -v v="$LOAD_1" -v t="$LOAD_THRESHOLD" 'BEGIN{ if(v+0>t+0) exit 0; else exit 1 }'
if [ $? -eq 0 ]; then
  ALERTS+=("High load: ${LOAD_1} (threshold ${LOAD_THRESHOLD})")
fi
if [ "$USED_PCT" -ge "$MEM_PCT_THRESHOLD" ]; then
  ALERTS+=("High memory usage: ${USED_PCT}% (threshold ${MEM_PCT_THRESHOLD}% )")
fi
if [ "$DISK_PCT" -ge "$DISK_PCT_THRESHOLD" ]; then
  ALERTS+=("Low disk space on /: ${DISK_PCT}% used (threshold ${DISK_PCT_THRESHOLD}% )")
fi
if [ $GATEWAY_OK -ne 0 ]; then
  ALERTS+=("Gateway port 18792 not listening")
fi
if [ ${#ALERTS[@]} -gt 0 ]; then
  # For each alert, decide whether to send (critical) or log only (warning)
  MSG_SEND="[ALERT] System checks:\n"
  MSG_LOG="[WARN] System checks (logged):\n"
  for a in "${ALERTS[@]}"; do
    # determine key and numeric severity
    if [[ "$a" == High\ load:* ]]; then
      key="load"
      val=$(echo "$LOAD_1" | sed 's/,/./')
      thr=$LOAD_THRESHOLD
      diff=$(awk -v v="$val" -v t="$thr" 'BEGIN{print (v-t)}')
      # treat as critical if diff >= 2.0 (configurable)
      if (( $(awk 'BEGIN{print ('"$diff"' >= 2.0)}') )); then
        if _allow_send "$key"; then MSG_SEND+="$a\n"; fi
      else
        MSG_LOG+="$a\n"
      fi
    elif [[ "$a" == High\ memory* ]]; then
      key="memory"
      val=$USED_PCT
      thr=$MEM_PCT_THRESHOLD
      diff=$((val - thr))
      if [ $diff -ge 5 ]; then
        if _allow_send "$key"; then MSG_SEND+="$a\n"; fi
      else
        MSG_LOG+="$a\n"
      fi
    elif [[ "$a" == Low\ disk* ]]; then
      key="disk"
      val=$DISK_PCT
      thr=$DISK_PCT_THRESHOLD
      diff=$((val - thr))
      if [ $diff -ge 5 ]; then
        if _allow_send "$key"; then MSG_SEND+="$a\n"; fi
      else
        MSG_LOG+="$a\n"
      fi
    else
      # gateway or other alerts: treat as critical
      key="other"
      if _allow_send "$key"; then MSG_SEND+="$a\n"; fi
    fi
  done
  # send critical alerts in Korean if any
  if [[ "$MSG_SEND" != "[ALERT] System checks:\n" ]]; then
    # translate and simplify messages for user
    KR_MSG="[시스템 경고]\n"
    # convert English alerts to Korean short sentences
    while IFS= read -r line; do
      case "$line" in
        *"High load:"*) KR_MSG+="- 시스템 부하가 높습니다. (1분 평균: ${LOAD_1})\n" ;;
        *"High memory usage:"*) KR_MSG+="- 메모리 사용률이 높습니다: ${USED_PCT}%\n" ;;
        *"Low disk space on /:"*) KR_MSG+="- 디스크 여유 공간이 적습니다: ${DISK_PCT}% 사용\n" ;;
        *"Gateway port 18792 not listening"*) KR_MSG+="- 내부 게이트웨이가 응답하지 않습니다(서비스 확인 필요)\n" ;;
        *) KR_MSG+="- 알림: ${line}\n" ;;
      esac
    done <<< "$(echo -e "$MSG_SEND")"
    # include short actionable advice
    KR_MSG+="\n권장 조치: 시스템(앱) 재시작 또는 문제 원인 로그 확인. 급한 경우 알려 주세요."
    # Use echo -e friendly message formatting
    _send "$(echo -e "$KR_MSG")"
  fi
  # always append warnings to system-monitor.out for visibility (in Korean)
  if [[ "$MSG_LOG" != "[WARN] System checks (logged):\n" ]]; then
    echo -e "[경고(로그)] $(date '+%Y-%m-%d %H:%M:%S')\n$MSG_LOG" >> /tmp/system-monitor.out
  fi
fi
# ensure successful exit even if some commands failed earlier
exit 0
