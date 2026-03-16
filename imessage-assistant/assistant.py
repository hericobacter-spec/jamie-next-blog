#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import subprocess
import urllib.parse
import urllib.request
from dataclasses import dataclass
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any

BASE_DIR = Path(__file__).resolve().parent


@dataclass
class Reply:
    text: str
    action: str
    meta: dict[str, Any] | None = None


class Assistant:
    def __init__(self, base_dir: Path | None = None):
        self.base_dir = Path(base_dir or BASE_DIR)
        self.config = self._load_json(self.base_dir / "config.json")
        self.allowed_path = self.base_dir / self.config.get("allowed_senders_file", "allowed_senders.json")
        self.shopping_path = self.base_dir / self.config.get("shopping_list_file", "shopping_list.json")
        self.state_path = self.base_dir / self.config.get("state_file", "state.json")

    def handle_message(self, sender: str, text: str) -> Reply:
        text = (text or "").strip()
        allowed = self._load_allowed_senders()
        if sender not in allowed or not allowed[sender].get("enabled", True):
            return Reply("등록되지 않은 발신자입니다.", "sender_not_allowed", {"sender": sender})

        lowered = text.lower()

        if self._looks_like_schedule_request(text):
            return self._reply_today_schedule()
        if self._looks_like_weather_request(text):
            return self._reply_weather(text)
        if self._looks_like_shopping_show_request(text):
            return self._reply_shopping_show()
        if self._looks_like_shopping_done_request(text):
            return self._reply_shopping_done(text)
        if self._looks_like_shopping_delete_request(text):
            return self._reply_shopping_delete(text)
        if self._looks_like_shopping_add_request(text):
            return self._reply_shopping_add(text, allowed[sender].get("name") or sender)
        reminder = self._parse_reminder(text)
        if reminder:
            return reminder

        return Reply(
            "아직 이해하지 못한 요청입니다. 예: 우유 추가 / 목록 보여줘 / 오늘 일정 / 오늘 날씨 / 30분 뒤에 약 먹으라고 알려줘",
            "fallback",
        )

    def _reply_shopping_add(self, text: str, actor: str) -> Reply:
        item = text
        item = re.sub(r"(추가해줘|추가해주세요|추가해 줘|추가)$", "", item).strip()
        item = re.sub(r"(사와|사 와)$", "", item).strip()
        item = re.sub(r"(도 추가)$", "", item).strip()
        if not item:
            return Reply("추가할 항목을 이해하지 못했습니다.", "shopping_add_invalid")

        data = self._load_json(self.shopping_path, default={"items": [], "updated_at": None})
        items = data.setdefault("items", [])
        for existing in items:
            if existing.get("name") == item:
                return Reply(f"장보기 목록에 이미 {item}가 있습니다.", "shopping_add_duplicate", {"item": item})

        items.append({"name": item, "done": False, "added_by": actor, "added_at": self._now_iso()})
        data["updated_at"] = self._now_iso()
        self._save_json(self.shopping_path, data)
        self._update_state(actor, text)
        return Reply(f"장보기 목록에 {item}를 추가했습니다.", "shopping_add", {"item": item})

    def _reply_shopping_show(self) -> Reply:
        data = self._load_json(self.shopping_path, default={"items": [], "updated_at": None})
        items = data.get("items", [])
        if not items:
            return Reply("현재 장보기 목록은 비어 있습니다.", "shopping_show_empty")
        lines = ["📋 장보기 목록"]
        for item in items:
            mark = "☑" if item.get("done") else "☐"
            lines.append(f"{mark} {item.get('name')}")
        return Reply("\n".join(lines), "shopping_show", {"count": len(items)})

    def _reply_shopping_done(self, text: str) -> Reply:
        item = re.sub(r"(샀어|완료|체크)$", "", text).strip()
        return self._set_item_done(item, True)

    def _reply_shopping_delete(self, text: str) -> Reply:
        item = re.sub(r"(삭제해줘|삭제)$", "", text).strip()
        data = self._load_json(self.shopping_path, default={"items": [], "updated_at": None})
        items = data.get("items", [])
        before = len(items)
        items = [x for x in items if x.get("name") != item]
        data["items"] = items
        data["updated_at"] = self._now_iso()
        self._save_json(self.shopping_path, data)
        if len(items) == before:
            return Reply(f"장보기 목록에서 {item}를 찾지 못했습니다.", "shopping_delete_missing", {"item": item})
        return Reply(f"장보기 목록에서 {item}를 삭제했습니다.", "shopping_delete", {"item": item})

    def _set_item_done(self, item: str, done: bool) -> Reply:
        if not item:
            return Reply("완료 처리할 항목을 이해하지 못했습니다.", "shopping_done_invalid")
        data = self._load_json(self.shopping_path, default={"items": [], "updated_at": None})
        for existing in data.get("items", []):
            if existing.get("name") == item:
                existing["done"] = done
                data["updated_at"] = self._now_iso()
                self._save_json(self.shopping_path, data)
                return Reply(f"장보기 목록에서 {item}를 완료 처리했습니다.", "shopping_done", {"item": item})
        return Reply(f"장보기 목록에서 {item}를 찾지 못했습니다.", "shopping_done_missing", {"item": item})

    def _reply_today_schedule(self) -> Reply:
        try:
            script = r'''
set todayStart to current date
set hours of todayStart to 0
set minutes of todayStart to 0
set seconds of todayStart to 0
set tomorrowStart to todayStart + (24 * 60 * 60)

tell application "Calendar"
	set outputLines to {}
	repeat with cal in calendars
		repeat with ev in (every event of cal whose start date ≥ todayStart and start date < tomorrowStart)
			set evStart to start date of ev
			set hh to text -2 thru -1 of ("0" & (hours of evStart as integer))
			set mm to text -2 thru -1 of ("0" & (minutes of evStart as integer))
			set loc to location of ev
			if loc is missing value then set loc to ""
			set end of outputLines to (hh & ":" & mm & "\t" & (summary of ev) & "\t" & loc)
		end repeat
	end repeat
end tell
set AppleScript's text item delimiters to linefeed
return outputLines as text
'''
            result = subprocess.run(["osascript", "-e", script], capture_output=True, text=True, timeout=20)
            lines = [line.strip() for line in result.stdout.splitlines() if line.strip()]
            if not lines:
                return Reply("오늘 일정은 없습니다.", "schedule_empty")
            parsed = []
            for line in lines:
                parts = line.split("\t")
                time = parts[0]
                title = parts[1] if len(parts) > 1 else "(제목 없음)"
                location = parts[2] if len(parts) > 2 else ""
                row = f"• {time} {title}"
                if location:
                    row += f" @{location}"
                parsed.append(row)
            return Reply("📅 오늘 일정\n" + "\n".join(sorted(parsed)), "schedule_today", {"count": len(parsed)})
        except Exception as e:
            return Reply(f"일정 조회 중 오류가 발생했습니다: {e}", "schedule_error")

    def _reply_weather(self, text: str) -> Reply:
        location = self.config.get("default_location", "세종")
        if "서울" in text:
            location = "서울"
        elif "대전" in text:
            location = "대전"
        elif "세종" in text:
            location = "세종"
        try:
            with urllib.request.urlopen(f"https://wttr.in/{urllib.parse.quote(location)}?format=j1", timeout=15) as r:
                payload = json.loads(r.read().decode("utf-8", "ignore"))
            current = payload["current_condition"][0]
            today = payload["weather"][0]
            chance_rain = today["hourly"][0].get("chanceofrain", "?") if today.get("hourly") else "?"
            desc = current.get("weatherDesc", [{}])[0].get("value", "날씨 정보 없음")
            temp = current.get("temp_C", "?")
            feels = current.get("FeelsLikeC", "?")
            min_temp = today.get("mintempC", "?")
            max_temp = today.get("maxtempC", "?")
            return Reply(
                f"🌤️ {location} 날씨\n{desc}, {temp}°C\n최저 {min_temp}°C / 최고 {max_temp}°C\n체감온도 {feels}°C, 강수확률 {chance_rain}%",
                "weather_today",
                {"location": location},
            )
        except Exception as e:
            return Reply(f"날씨 조회 중 오류가 발생했습니다: {e}", "weather_error")

    def _parse_reminder(self, text: str) -> Reply | None:
        relative = re.search(r"(\d+)\s*분\s*뒤.*?알려", text)
        if relative:
            minutes = int(relative.group(1))
            return Reply(
                f"리마인더 초안: {minutes}분 뒤 알림 등록 대상입니다. 실제 cron 등록 연결은 다음 단계에서 붙이면 됩니다.",
                "reminder_draft_relative",
                {"minutes": minutes},
            )

        absolute = re.search(r"내일\s*(오전|오후)?\s*(\d{1,2})\s*시.*?알려", text)
        if absolute:
            ampm = absolute.group(1)
            hour = int(absolute.group(2))
            if ampm == "오후" and hour < 12:
                hour += 12
            if ampm == "오전" and hour == 12:
                hour = 0
            target = datetime.now() + timedelta(days=1)
            target = target.replace(hour=hour, minute=0, second=0, microsecond=0)
            return Reply(
                f"리마인더 초안: {target.strftime('%Y-%m-%d %H:%M')} 알림 등록 대상입니다. 실제 cron 등록 연결은 다음 단계에서 붙이면 됩니다.",
                "reminder_draft_absolute",
                {"at": target.isoformat()},
            )
        return None

    def _looks_like_schedule_request(self, text: str) -> bool:
        return "일정" in text

    def _looks_like_weather_request(self, text: str) -> bool:
        return "날씨" in text or "비 와" in text

    def _looks_like_shopping_show_request(self, text: str) -> bool:
        return any(key in text for key in ["목록 보여", "장보기 목록", "목록 알려"])

    def _looks_like_shopping_add_request(self, text: str) -> bool:
        return any(key in text for key in ["추가", "사와"]) and not self._looks_like_shopping_delete_request(text)

    def _looks_like_shopping_done_request(self, text: str) -> bool:
        return any(key in text for key in ["샀어", "완료", "체크"])

    def _looks_like_shopping_delete_request(self, text: str) -> bool:
        return "삭제" in text

    def _load_allowed_senders(self) -> dict[str, Any]:
        if self.allowed_path.exists():
            return self._load_json(self.allowed_path, default={})
        sample = self.base_dir / "allowed_senders.sample.json"
        if sample.exists():
            return self._load_json(sample, default={})
        return {}

    def _load_json(self, path: Path, default: Any | None = None) -> Any:
        if not path.exists():
            return {} if default is None else default
        with path.open("r", encoding="utf-8") as f:
            return json.load(f)

    def _save_json(self, path: Path, payload: Any) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)

    def _update_state(self, sender: str, text: str) -> None:
        data = self._load_json(self.state_path, default={})
        data["last_processed_at"] = self._now_iso()
        data["last_sender"] = sender
        data["last_text"] = text
        self._save_json(self.state_path, data)

    def _now_iso(self) -> str:
        return datetime.now().isoformat(timespec="seconds")
