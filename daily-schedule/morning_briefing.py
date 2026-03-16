#!/usr/bin/env python3
import json
import os
import subprocess
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta

ENV_FILE = "/Users/jamie/.openclaw/workspace/daily-korean-news/.env"
ICAL = "/opt/homebrew/bin/icalbuddy"
RSS_URL = "https://news.google.com/rss?hl=ko&gl=KR&ceid=KR:ko"
LAT = 36.4804
LON = 127.2890
TZ = "Asia/Seoul"


def load_env(path: str):
    if not os.path.exists(path):
        return
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip())


def run(cmd):
    try:
        p = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        if p.returncode == 0:
            return p.stdout.strip()
        return ""
    except Exception:
        return ""


def fetch_json(url: str):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode("utf-8"))


def fetch_text(url: str):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        return resp.read().decode("utf-8", errors="replace")


def get_weather():
    try:
        url = (
            "https://api.open-meteo.com/v1/forecast?"
            + urllib.parse.urlencode(
                {
                    "latitude": LAT,
                    "longitude": LON,
                    "current": "temperature_2m,apparent_temperature,weather_code,precipitation_probability",
                    "daily": "temperature_2m_min,temperature_2m_max",
                    "forecast_days": 1,
                    "timezone": TZ,
                }
            )
        )
        data = fetch_json(url)
        cur = data.get("current", {})
        code = cur.get("weather_code")
        desc_map = {
            0: "맑음", 1: "대체로 맑음", 2: "부분적으로 흐림", 3: "흐림",
            45: "안개", 48: "서리 안개", 51: "이슬비", 53: "이슬비", 55: "짙은 이슬비",
            61: "비", 63: "비", 65: "강한 비", 71: "눈", 73: "눈", 75: "강한 눈",
            80: "소나기", 81: "소나기", 82: "강한 소나기", 95: "뇌우"
        }
        desc = desc_map.get(code, "날씨 정보")
        temp = round(float(cur.get("temperature_2m", 0)))
        feels = round(float(cur.get("apparent_temperature", temp)))
        pop = round(float(cur.get("precipitation_probability", 0)))
        daily = data.get("daily", {})
        tmin_list = daily.get("temperature_2m_min") or []
        tmax_list = daily.get("temperature_2m_max") or []
        tmin = round(float(tmin_list[0])) if tmin_list else None
        tmax = round(float(tmax_list[0])) if tmax_list else None
        minmax_line = f"최저 {tmin}°C / 최고 {tmax}°C" if tmin is not None and tmax is not None else None
        parts = ["🌤️ 오늘의 날씨", f"{desc}, {temp}°C"]
        if minmax_line:
            parts.append(minmax_line)
        parts.append(f"체감온도 {feels}°C, 강수확률 {pop}%")
        return "\n".join(parts)
    except Exception:
        return "🌤️ 오늘의 날씨\n조회 실패"


def get_unread_emails(max_items=3):
    out = run(["gog", "gmail", "search", "is:unread in:inbox newer_than:30d", "--max", str(max_items), "--json", "--no-input"])
    items = []
    total = 0
    if out:
        try:
            data = json.loads(out)
            if isinstance(data, dict):
                data = data.get("threads") or data.get("messages") or data.get("items") or data.get("results") or []
            total = len(data)
            for msg in data[:max_items]:
                sender = msg.get("from") or msg.get("sender") or msg.get("author") or "보낸사람"
                if "<" in sender:
                    sender = sender.split("<", 1)[0].strip()
                subject = msg.get("subject") or "(제목 없음)"
                labels = msg.get("labels") or []
                icon = "🔴" if "IMPORTANT" in labels else "⚪"
                items.append(f"• {icon} {sender}: {subject}")
        except Exception:
            pass
    header = f"📧 미확인 이메일 {total}개"
    if not items:
        return header + "\n• 없음"
    return header + "\n" + "\n".join(items)


def normalize_time_range(s: str) -> str:
    s = s.replace("today at ", "").replace("tomorrow at ", "")
    import re

    def repl(m):
        ampm = m.group(1)
        hh = int(m.group(2))
        mm = m.group(3)
        if ampm == "오후" and hh < 12:
            hh += 12
        if ampm == "오전" and hh == 12:
            hh = 0
        return f"{hh:02d}:{mm}"

    s = re.sub(r"(오전|오후)\s*(\d{1,2}):(\d{2})", repl, s)
    return s.strip()


def get_todays_schedule():
    today = datetime.now().strftime("%Y-%m-%d")
    tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
    items = []

    raw = ""
    if os.path.exists(ICAL):
        raw = run([ICAL, f"eventsFrom:{today}", f"to:{tomorrow}"])
    if raw:
        lines = raw.splitlines()
        i = 0
        while i < len(lines):
            line = lines[i].rstrip()
            if line.startswith("• "):
                title = line[2:].strip()
                when = ""
                if i + 1 < len(lines):
                    nxt = lines[i + 1].strip()
                    if nxt:
                        when = nxt
                if when:
                    item = f"• {normalize_time_range(when)} {title}"
                else:
                    item = f"• {title}"
                items.append(item)
            i += 1
    if not items:
        script = f'''
        set startDate to date "{today} 00:00:00"
        set endDate to date "{tomorrow} 00:00:00"
        set outLines to {{}}
        tell application "Calendar"
            repeat with cal in calendars
                try
                    set evs to (every event of cal whose start date ≥ startDate and start date < endDate)
                on error
                    set evs to {{}}
                end try
                repeat with e in evs
                    set sDate to start date of e
                    set hh to text -2 thru -1 of ("0" & (hours of sDate))
                    set mm to text -2 thru -1 of ("0" & (minutes of sDate))
                    set loc to location of e
                    if loc is missing value then set loc to ""
                    set end of outLines to (hh & ":" & mm & "||" & (summary of e) & "||" & loc)
                end repeat
            end repeat
        end tell
        set AppleScript's text item delimiters to "\n"
        return outLines as string
        '''
        raw = run(["osascript", "-e", script])
        for line in raw.splitlines():
            line = line.strip()
            if not line or "||" not in line:
                continue
            parts = line.split("||")
            if len(parts) >= 3:
                t, title, loc = parts[0].strip(), parts[1].strip(), parts[2].strip()
                item = f"• {t} {title}"
                if loc:
                    item += f" @{loc}"
                items.append(item)

    deduped = []
    seen = set()
    for x in items:
        if x not in seen:
            seen.add(x)
            deduped.append(x)
    header = f"📅 오늘 일정 ({len(deduped)}개)"
    if not deduped:
        return header + "\n• 일정 없음"
    return header + "\n" + "\n".join(deduped[:10])


def get_news(max_items=10):
    try:
        xml_text = fetch_text(RSS_URL)
        root = ET.fromstring(xml_text)
        titles = []
        for item in root.findall(".//item"):
            title = (item.findtext("title") or "").strip()
            if title:
                title = title.replace(" - Google 뉴스", "").replace(" - Google News", "")
                titles.append(title)
            if len(titles) >= max_items:
                break
        if not titles:
            raise ValueError("no titles")
        return "📰 주요 뉴스\n" + "\n".join(f"• {t}" for t in titles)
    except Exception:
        return "📰 주요 뉴스\n• 조회 실패"


def build_message():
    parts = [get_weather(), "", get_unread_emails(), "", get_todays_schedule(), "", get_news()]
    return "\n".join(parts).strip()


def send_telegram(text: str):
    bot = os.environ.get("TELEGRAM_BOT_TOKEN")
    chat = os.environ.get("TELEGRAM_CHAT_ID")
    if not bot or not chat:
        raise RuntimeError("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID")
    url = f"https://api.telegram.org/bot{bot}/sendMessage"
    data = urllib.parse.urlencode({"chat_id": chat, "text": text}).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="POST")
    with urllib.request.urlopen(req, timeout=20) as resp:
        return resp.read().decode("utf-8", errors="replace")


def main():
    load_env(ENV_FILE)
    text = build_message()
    if "--print" in sys.argv:
        print(text)
        return
    print(send_telegram(text))


if __name__ == "__main__":
    main()
