#!/usr/bin/env python3
"""Apple Calendar 15-min reminder for OpenClaw cron.

- Queries macOS Calendar via icalBuddy for events starting within the next WINDOW_MIN minutes.
- Dedupes reminders using a JSON state file.
- Emits either:
  - NO_REPLY (when nothing to remind)
  - One or more lines: [일정 15분 전 리마인드] HH:MM 일정명 (캘린더명)

Designed to be run every ~5 minutes.
"""

from __future__ import annotations

import datetime as dt
import json
import os
import re
import subprocess
from pathlib import Path

WINDOW_MIN = int(os.environ.get("OPENCLAW_REMINDER_WINDOW_MIN", "20"))
STATE_PATH = Path(os.environ.get(
    "OPENCLAW_REMINDER_STATE",
    "/Users/jamie/.openclaw/workspace/memory/apple-calendar-reminder-state.json",
))

TIME_RE = re.compile(r"^(?P<time>\d{1,2}:\d{2})\s+(?P<title>.+?)\s*$")


def _load_state() -> dict:
    if not STATE_PATH.exists():
        return {"sent": {}}
    try:
        with STATE_PATH.open("r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {"sent": {}}


def _save_state(state: dict) -> None:
    STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
    tmp = STATE_PATH.with_suffix(STATE_PATH.suffix + ".tmp")
    with tmp.open("w", encoding="utf-8") as f:
        json.dump(state, f, ensure_ascii=False, indent=2)
    tmp.replace(STATE_PATH)


def _now_range() -> tuple[str, str]:
    now = dt.datetime.now()
    end = now + dt.timedelta(minutes=WINDOW_MIN)
    fmt = "%Y-%m-%d %H:%M"
    return now.strftime(fmt), end.strftime(fmt)


def _icalbuddy_output(start: str, end: str) -> str:
    # Separate by calendar so we can carry calendar name into the reminder.
    cmd = [
        "icalBuddy",
        "-ea",      # exclude all-day
        "-nrd",     # no relative dates
        "-sc",      # separate by calendar
        "eventsFrom:%s" % start,
        "to:%s" % end,
    ]
    p = subprocess.run(cmd, capture_output=True, text=True)
    out = (p.stdout or "").strip("\n")
    # Some setups emit nothing if no events.
    return out


def _parse_events(text: str) -> list[dict]:
    """Best-effort parse of icalBuddy output with -sc.

    Expected-ish structure (varies by config):
      <Calendar Name>:
        • HH:MM Title
        • HH:MM Title

    We'll ignore lines we can't parse cleanly.
    """
    events: list[dict] = []
    cal = None
    for raw in text.splitlines():
        line = raw.strip()
        if not line:
            continue
        # Calendar header
        if line.endswith(":") and not line.startswith("•"):
            cal = line[:-1].strip() or None
            continue
        # Event line (strip leading bullet)
        if line.startswith("•"):
            line = line.lstrip("•").strip()
        m = TIME_RE.match(line)
        if not m:
            continue
        t = m.group("time")
        title = m.group("title")
        events.append({"time": t, "title": title, "calendar": cal or ""})
    return events


def main() -> None:
    start, end = _now_range()
    out = _icalbuddy_output(start, end)
    if not out.strip():
        print("NO_REPLY")
        return

    events = _parse_events(out)
    if not events:
        print("NO_REPLY")
        return

    state = _load_state()
    sent = state.setdefault("sent", {})

    today = dt.date.today().isoformat()
    pruned = {}
    # Keep only last ~2 days to avoid unbounded growth.
    for k, v in sent.items():
        if isinstance(v, str) and v >= (dt.date.today() - dt.timedelta(days=2)).isoformat():
            pruned[k] = v
    sent.clear()
    sent.update(pruned)

    lines = []
    for e in events:
        # Key by date + time + title + calendar (good enough).
        key = f"{today}|{e['time']}|{e['title']}|{e['calendar']}"
        if key in sent:
            continue
        cal_part = f" ({e['calendar']})" if e.get("calendar") else ""
        lines.append(f"[일정 15분 전 리마인드] {e['time']} {e['title']}{cal_part}")
        sent[key] = today

    _save_state(state)

    if not lines:
        print("NO_REPLY")
        return

    print("\n".join(lines))


if __name__ == "__main__":
    main()
