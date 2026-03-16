#!/usr/bin/env python3
"""Update OpenClaw bootstrap context from Obsidian + OpenClaw memory.

Goal
- When a new session/model starts, the agent can reliably restore context by reading
  `memory/bootstrap-context.md`.

This script regenerates that file by pulling small, stable excerpts from:
- Obsidian Vault bootstrap note
- Selected Obsidian operational notes
- OpenClaw MEMORY.md + recent daily notes (lightweight pointers only)

Design principles
- Deterministic output (no LLM).
- Conservative size: keep under ~250 lines.
- Never copy secrets: redact common token patterns.

Usage
  python3 tools/update_bootstrap_context.py

"""

from __future__ import annotations

import datetime as _dt
import os
import re
from pathlib import Path

WORKSPACE = Path("/Users/jamie/.openclaw/workspace")
OUT_FILE = WORKSPACE / "memory" / "bootstrap-context.md"
MEMORY_MD = WORKSPACE / "MEMORY.md"
DAILY_DIR = WORKSPACE / "memory"

OBSIDIAN_VAULT = Path("/Users/jamie/Library/Mobile Documents/iCloud~md~obsidian/Documents/work")
OB_BOOT = OBSIDIAN_VAULT / "SmartHome" / "OpenClaw" / "00 - 부팅컨텍스트 (Jarvis).md"

# A small curated set of notes that tend to contain durable ops context.
OBSIDIAN_SOURCES = [
    OB_BOOT,
    OBSIDIAN_VAULT / "OpenClaw" / "UGREEN-NAS-Docker-OpenClaw-설치-성공매뉴얼.md",
    OBSIDIAN_VAULT / "OpenClaw" / "UGREEN-NAS-운영-보안-체크리스트.md",
    OBSIDIAN_VAULT / "OpenClaw" / "스킬-보안-체크리스트(ClawHub-VirusTotal-CodeInsight).md",
    OBSIDIAN_VAULT / "SmartHome" / "n8n" / "n8n - 평일 06-30 거실1 켜기 (HA 호출) 설정.md",
]

REDACT_PATTERNS = [
    # Telegram bot token like 123456:ABC...
    (re.compile(r"\b\d{6,12}:[A-Za-z0-9_-]{20,}\b"), "<REDACTED_TELEGRAM_BOT_TOKEN>"),
    # Long bearer tokens
    (re.compile(r"Bearer\s+[A-Za-z0-9._-]{20,}", re.IGNORECASE), "Bearer <REDACTED_TOKEN>"),
    # generic secrets-ish strings
    (re.compile(r"\b[A-Fa-f0-9]{32,}\b"), "<REDACTED_HEX>"),
]


def _read_text(p: Path) -> str:
    try:
        return p.read_text(encoding="utf-8")
    except FileNotFoundError:
        return ""
    except Exception:
        return p.read_text(errors="ignore")


def _redact(text: str) -> str:
    out = text
    for rx, repl in REDACT_PATTERNS:
        out = rx.sub(repl, out)
    return out


def _excerpt(md: str, *, max_lines: int = 80, max_chars: int = 4500) -> str:
    lines = [ln.rstrip() for ln in md.splitlines()]
    # drop empty leading lines
    while lines and not lines[0].strip():
        lines.pop(0)
    out_lines = []
    total = 0
    for ln in lines:
        if len(out_lines) >= max_lines:
            break
        total += len(ln) + 1
        if total > max_chars:
            break
        out_lines.append(ln)
    return "\n".join(out_lines).strip()


def _recent_daily_files(days: int = 2) -> list[Path]:
    today = _dt.date.today()
    files = []
    for d in range(days):
        dt = today - _dt.timedelta(days=d)
        p = DAILY_DIR / f"{dt.isoformat()}.md"
        if p.exists():
            files.append(p)
    return files


def main() -> int:
    ts = _dt.datetime.now().astimezone().isoformat(timespec="seconds")
    OUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    sections: list[str] = []
    sections.append(f"# Bootstrap Context (auto-generated)\n\nUpdated: {ts}\n")

    sections.append("## Quick pointers (source of truth)\n" +
                    f"- Obsidian Vault: `{OBSIDIAN_VAULT}`\n" +
                    f"- Obsidian bootstrap: `{OB_BOOT}`\n" +
                    f"- OpenClaw MEMORY.md: `{MEMORY_MD}`\n" +
                    f"- Daily notes dir: `{DAILY_DIR}`\n")

    # Obsidian excerpts
    ob_blocks = []
    for p in OBSIDIAN_SOURCES:
        txt = _read_text(p)
        if not txt.strip():
            continue
        ex = _excerpt(_redact(txt), max_lines=60, max_chars=3500)
        ob_blocks.append(f"### {p.relative_to(OBSIDIAN_VAULT)}\n\n```md\n{ex}\n```")
    if ob_blocks:
        sections.append("## Obsidian excerpts (curated)\n\n" + "\n\n".join(ob_blocks))

    # OpenClaw memory pointer excerpt (top only, avoid ballooning)
    mem_txt = _read_text(MEMORY_MD)
    if mem_txt.strip():
        ex = _excerpt(_redact(mem_txt), max_lines=60, max_chars=3000)
        sections.append("## OpenClaw MEMORY.md (top excerpt)\n\n```md\n" + ex + "\n```")

    # Recent daily note pointers (titles only)
    recent = _recent_daily_files(2)
    if recent:
        items = "\n".join([f"- {p.name}" for p in recent])
        sections.append("## Recent daily notes present\n" + items)

    # Hard-coded operational invariants (safe)
    sections.append(
        "## Operational invariants\n"
        "- NAS SUPER mounts under `~/NetworkDrives/*` (not `/Volumes/super`).\n"
        "- For Telegram schedule/alerts, env is in `daily-korean-news/.env`.\n"
        "- Gateway is loopback-only by default; typical port 18789.\n"
    )

    out = "\n\n".join(sections).strip() + "\n"
    OUT_FILE.write_text(out, encoding="utf-8")
    print(f"Wrote: {OUT_FILE} ({len(out.splitlines())} lines)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
