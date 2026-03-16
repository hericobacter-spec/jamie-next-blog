#!/usr/bin/env python3
from __future__ import annotations

import argparse
import subprocess
import sys


def applescript_escape(text: str) -> str:
    return text.replace('\\', '\\\\').replace('"', '\\"')


def send_imessage(recipient: str, text: str) -> int:
    recipient = recipient.strip()
    if not recipient:
        raise ValueError('recipient is required')

    script = f'''
tell application "Messages"
	set targetService to 1st service whose service type = iMessage
	set targetBuddy to participant "{applescript_escape(recipient)}" of targetService
	send "{applescript_escape(text)}" to targetBuddy
end tell
'''
    result = subprocess.run(["osascript", "-e", script], capture_output=True, text=True, timeout=20)
    if result.returncode != 0:
        sys.stderr.write(result.stderr)
        return result.returncode
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description='Send iMessage reply via Messages.app AppleScript (phone or email handle)')
    parser.add_argument('--to', required=True)
    parser.add_argument('--text', required=True)
    args = parser.parse_args()
    return send_imessage(args.to, args.text)


if __name__ == '__main__':
    raise SystemExit(main())
