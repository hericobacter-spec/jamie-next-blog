#!/usr/bin/env python3
from __future__ import annotations

import json
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path

from assistant import Assistant

BASE_DIR = Path(__file__).resolve().parent
CONFIG = json.loads((BASE_DIR / 'config.json').read_text(encoding='utf-8'))
STATE_PATH = BASE_DIR / 'imsg_history_state.json'
LOG_PATH = BASE_DIR / CONFIG.get('watcher_log_file', 'watcher.log')
IMSG_PATH = CONFIG.get('imsg_path', '/opt/homebrew/bin/imsg')
POLL_SECONDS = 4
OWNER_SENDERS = {'+821030141521', 'hericobacter@live.com'}


def log(msg: str) -> None:
    ts = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    with LOG_PATH.open('a', encoding='utf-8') as f:
        f.write(f'[{ts}] {msg}\n')


def load_state() -> dict:
    if STATE_PATH.exists():
        return json.loads(STATE_PATH.read_text(encoding='utf-8'))
    return {'last_seen_ids': {}, 'last_started_at': None, 'last_event_at': None}


def save_state(state: dict) -> None:
    STATE_PATH.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding='utf-8')


def run_json_lines(cmd: list[str], timeout: int = 30) -> list[dict]:
    p = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
    if p.returncode != 0:
        raise RuntimeError(p.stderr.strip() or f'command failed: {cmd}')
    out = []
    for line in p.stdout.splitlines():
        line = line.strip()
        if not line:
            continue
        out.append(json.loads(line))
    return out


def normalize_sender(sender: str) -> str:
    sender = (sender or '').strip()
    if sender.startswith('010') and len(sender) == 11:
        return '+82' + sender[1:]
    return sender


def allowed_senders() -> dict:
    path = BASE_DIR / CONFIG.get('allowed_senders_file', 'allowed_senders.json')
    return json.loads(path.read_text(encoding='utf-8')) if path.exists() else {}


def get_chat_map() -> dict[str, int]:
    rows = run_json_lines([IMSG_PATH, 'chats', '--limit', '50', '--json'])
    mapping = {}
    for row in rows:
        ident = normalize_sender(row.get('identifier', ''))
        cid = row.get('id')
        if ident and cid:
            mapping[ident] = int(cid)
    return mapping


def seed_latest_ids(state: dict, chats: dict[str, int], allowed: dict) -> None:
    state.setdefault('last_seen_ids', {})
    for sender, meta in allowed.items():
        if not meta.get('enabled', True):
            continue
        if str(state['last_seen_ids'].get(sender, '0')) not in ('', '0'):
            continue
        chat_id = chats.get(sender)
        if not chat_id:
            continue
        try:
            rows = run_json_lines([IMSG_PATH, 'history', '--chat-id', str(chat_id), '--limit', '1', '--json'])
            if rows:
                state['last_seen_ids'][sender] = int(rows[0].get('id') or 0)
        except Exception:
            continue


def send_reply(to_value: str, text: str) -> None:
    cmd = [sys.executable, str(BASE_DIR / 'send_reply.py'), '--to', to_value, '--text', text]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or 'reply send failed')


def should_process(msg: dict, chat_ident: str) -> bool:
    text = (msg.get('text') or '').strip()
    if not text:
        return False
    if text.startswith('[자비스 테스트]'):
        return False

    sender = normalize_sender(msg.get('sender', ''))
    is_from_me = bool(msg.get('is_from_me'))

    if chat_ident in OWNER_SENDERS:
        return True
    return (not is_from_me) and sender == chat_ident


def main() -> int:
    assistant = Assistant(BASE_DIR)
    allowed = allowed_senders()
    state = load_state()
    state['last_started_at'] = datetime.now().isoformat(timespec='seconds')
    save_state(state)
    log('starting imsg history poller')

    while True:
        try:
            chats = get_chat_map()
            seed_latest_ids(state, chats, allowed)
            save_state(state)
            for sender, meta in allowed.items():
                if not meta.get('enabled', True):
                    continue
                chat_id = chats.get(sender)
                if not chat_id:
                    continue
                rows = run_json_lines([IMSG_PATH, 'history', '--chat-id', str(chat_id), '--limit', '8', '--json'])
                rows.reverse()  # oldest -> newest
                last_seen = int(state.get('last_seen_ids', {}).get(sender, 0) or 0)
                for msg in rows:
                    msg_id = int(msg.get('id') or 0)
                    if msg_id <= last_seen:
                        continue
                    state.setdefault('last_seen_ids', {})[sender] = msg_id
                    text = (msg.get('text') or '').strip()
                    actual_sender = normalize_sender(msg.get('sender', ''))
                    is_from_me = int(bool(msg.get('is_from_me')))

                    if not should_process(msg, sender):
                        save_state(state)
                        continue

                    log(f"history sender={sender} actual_sender={actual_sender} is_from_me={is_from_me} text={text}")
                    reply = assistant.handle_message(sender, text)
                    state['last_event_at'] = datetime.now().isoformat(timespec='seconds')
                    save_state(state)

                    if reply.action == 'sender_not_allowed':
                        log(f'ignored sender={sender}')
                        continue

                    reply_text = reply.text
                    if sender in OWNER_SENDERS:
                        reply_text = f'[자비스 테스트] {reply_text}'

                    try:
                        send_reply(sender, reply_text)
                        log(f"replied sender={sender} action={reply.action}")
                    except Exception as e:
                        log(f"reply failed sender={sender} action={reply.action} error={e}")

                    time.sleep(0.3)

            save_state(state)
            time.sleep(POLL_SECONDS)
        except Exception as e:
            log(f'history poller error={e}')
            time.sleep(5)


if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except KeyboardInterrupt:
        raise SystemExit(0)
