#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path

from assistant import Assistant

BASE_DIR = Path(__file__).resolve().parent
OWNER_SENDER = 'hericobacter@live.com'


def main() -> int:
    parser = argparse.ArgumentParser(description='Run internal debug test for iMessage assistant without real sending')
    parser.add_argument('--text', required=True, help='message text to simulate')
    parser.add_argument('--sender', default=OWNER_SENDER, help='sender identity to simulate')
    parser.add_argument('--prefix-test-tag', action='store_true', help='prefix reply with [자비스 테스트] like self-test mode')
    args = parser.parse_args()

    assistant = Assistant(BASE_DIR)
    reply = assistant.handle_message(args.sender, args.text)
    out = reply.text
    if args.prefix_test_tag:
        out = f'[자비스 테스트] {out}'

    print(json.dumps({
        'sender': args.sender,
        'input': args.text,
        'action': reply.action,
        'reply': out,
        'meta': reply.meta or {}
    }, ensure_ascii=False, indent=2))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
