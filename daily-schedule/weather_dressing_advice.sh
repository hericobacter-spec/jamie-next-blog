#!/usr/bin/env bash
set -euo pipefail
# Weather dressing advice for Sejong — runs weekdays at 07:00 KST
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
# Only run weekdays
WDAY=$(date +%u)
if [ "$WDAY" -gt 5 ]; then
  exit 0
fi
CITY="Sejong"
# Fetch weather primarily from Open-Meteo (reliable, no API key). Fallback to wttr.in on failure.
# Open-Meteo API: latitude/longitude for Sejong. Sejong coordinates: 36.4804 N, 127.2890 E
LAT=36.4804
LON=127.2890
OPENMETEO_URL="https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&hourly=temperature_2m,precipitation_probability&daily=temperature_2m_max,temperature_2m_min&current_weather=true&timezone=Asia%2FSeoul"
# try Open-Meteo with retries
OPEN_JSON=""
for i in 1 2 3; do
  OPEN_JSON=$(curl -sS --max-time 10 "$OPENMETEO_URL" 2>/dev/null || true)
  if [ -n "$OPEN_JSON" ]; then break; fi
  sleep 1
done
if [ -n "$OPEN_JSON" ] && python3 - <<PY
import json,sys
s='''$OPEN_JSON'''
try:
  json.loads(s)
  sys.exit(0)
except Exception:
  sys.exit(1)
PY
then
  JSON="$OPEN_JSON"
  SOURCE="open-meteo"
else
  # fallback to wttr.in
  JSON=$(curl -sS "https://wttr.in/${CITY}?format=j1" 2>/dev/null || true)
  SOURCE="wttr"
fi
# Build CURRENT_TEMP_FEELS_MAX_MIN and full JSON string for later python processing
CURRENT_TEMP_FEELS_MAX_MIN=""
# Build a detailed message using JSON data (supports Open-Meteo and wttr formats)
MSG=$(python3 - <<PY
import json,sys
j='''$JSON'''
CITY='$CITY'
try:
    data=json.loads(j)
    lines=[]
    lines.append(f"[오늘의 옷차림] {CITY} — {__import__('datetime').datetime.now().strftime('%Y-%m-%d')}")
    lines.append("")
    # detect Open-Meteo by presence of 'current_weather'
    if 'current_weather' in data:
        cur=data.get('current_weather',{})
        temp=str(cur.get('temperature','N/A'))
        feels=temp
        daily=data.get('daily',{})
        maxt=list(daily.get('temperature_2m_max',[]))
        mint=list(daily.get('temperature_2m_min',[]))
        maxt=maxt[0] if maxt else 'N/A'
        mint=mint[0] if mint else 'N/A'
        hh_times=data.get('hourly',{}).get('time',[])
        hh_temps=data.get('hourly',{}).get('temperature_2m',[])
        hh_pops=data.get('hourly',{}).get('precipitation_probability',[])
        lines.append(f"현재: {temp}°C (체감 {feels}°C) — 오늘 최고/최저: {maxt}°C / {mint}°C")
        lines.append("")
        lines.append('시간대별 예보 및 권장 의상:')
        for t,temp_h,pop in zip(hh_times[:24], hh_temps[:24], hh_pops[:24]):
            hh = t.split('T')[-1][:5]
            pop=int(pop or 0)
            tempv=int(round(float(temp_h)))
            if tempv<=5:
                a='두꺼운 패딩이나 코트를 권장합니다.'
            elif tempv<=12:
                a='코트나 두꺼운 재킷을 권장합니다.'
            elif tempv<=18:
                a='가벼운 재킷이나 니트 착용을 권장합니다.'
            elif tempv<=24:
                a='얇은 셔츠나 가디건을 권장합니다.'
            else:
                a='반팔·반바지 차림을 권장합니다.'
            rain_note = ' 우산을 챙기시는 것을 권장합니다.' if pop>=30 else ''
            lines.append(f"{hh} — {temp_h}°C, 강수 {pop}% — 권장: {a}{rain_note}")
        maxpop=max(hh_pops[:24]) if hh_pops else 0
        overall=''
        try:
            mt=int(round(float(mint)))
            MT=int(round(float(maxt)))
            if MT<=10:
                overall='오늘은 전체적으로 따뜻한 옷이 필요합니다.'
            elif mt>=25:
                overall='한낮에는 더우니 가벼운 복장 권장.'
            else:
                overall='시간대별로 겹쳐 입거나 가벼운 아우터를 권장합니다.'
        except:
            overall='상세 기온 정보를 확인하세요.'
        if maxpop>=30:
            overall += f" 우산 권장(최대 강수확률 {maxpop}%)."
        lines.append("")
        lines.append('종합 권장: '+overall)
    else:
        cur=data.get('current_condition',[{}])[0]
        temp=cur.get('temp_C','N/A')
        feels=cur.get('FeelsLikeC','N/A')
        weather0=data.get('weather',[{}])[0]
        maxt=weather0.get('maxtempC','N/A')
        mint=weather0.get('mintempC','N/A')
        hourly=weather0.get('hourly',[])
        lines.append(f"현재: {temp}°C (체감 {feels}°C) — 오늘 최고/최저: {maxt}°C / {mint}°C")
        lines.append("")
        lines.append('시간대별 예보 및 권장 의상:')
        for h in hourly[:24]:
            time=h.get('time','0')
            t=int(time) if time else 0
            hh = f"{t//100:02d}:00"
            temp_h = h.get('tempC','N/A')
            pop = int(h.get('chanceofrain','0')) if h.get('chanceofrain') else 0
            try:
                tempv=int(temp_h)
            except:
                tempv=15
            if tempv<=5:
                a='두꺼운 패딩이나 코트를 권장합니다.'
            elif tempv<=12:
                a='코트나 두꺼운 재킷을 권장합니다.'
            elif tempv<=18:
                a='가벼운 재킷이나 니트 착용을 권장합니다.'
            elif tempv<=24:
                a='얇은 셔츠나 가디건을 권장합니다.'
            else:
                a='반팔·반바지 차림을 권장합니다.'
            rain_note = ' 우산을 챙기시는 것을 권장합니다.' if pop>=30 else ''
            lines.append(f"{hh} — {temp_h}°C, 강수 {pop}% — 권장: {a}{rain_note}")
        pops = [int(x.get('chanceofrain','0') or 0) for x in hourly]
        maxpop = max(pops) if pops else 0
        overall = ''
        try:
            mt = int(mint)
            MT = int(maxt)
            if MT<=10:
                overall='오늘은 전체적으로 따뜻한 옷이 필요합니다.'
            elif mt>=25:
                overall='한낮에는 더우니 가벼운 복장 권장.'
            else:
                overall='시간대별로 겹쳐 입거나 가벼운 아우터를 권장합니다.'
        except:
            overall='상세 기온 정보를 확인하세요.'
        if maxpop>=30:
            overall += f" 우산 권장(최대 강수확률 {maxpop}%)."
        lines.append("")
        lines.append('종합 권장: '+overall)
    print('\n'.join(lines))
except Exception as e:
    print(f"[오늘의 옷차림] {CITY} — {__import__('datetime').datetime.now().strftime('%Y-%m-%d')}\n\n데이터를 가져오는 중 오류가 발생했습니다.")
PY
)
# send via Telegram
curl -sS -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" -d chat_id="$TELEGRAM_CHAT_ID" -d text="$MSG" >/dev/null || true
exit 0
