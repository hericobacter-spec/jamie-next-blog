#!/usr/bin/env python3
import argparse
import json
from assistant import Assistant


def main() -> int:
    parser = argparse.ArgumentParser(description="Test iMessage assistant locally")
    parser.add_argument("--sender", required=True, help="E.164 sender number, e.g. +821030141521")
    parser.add_argument("--text", required=True, help="Incoming message text")
    args = parser.parse_args()

    assistant = Assistant()
    reply = assistant.handle_message(args.sender, args.text)
    print(json.dumps({
        "action": reply.action,
        "text": reply.text,
        "meta": reply.meta or {}
    }, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
