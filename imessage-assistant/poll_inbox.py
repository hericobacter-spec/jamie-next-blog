#!/usr/bin/env python3
from __future__ import annotations

import json
import sqlite3
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path

from assistant import Assistant

BASE_DIR = Path(__file__).resolve().parent
CONFIG = json.loads((BASE_DIR / 'config.json').read_text(encoding='utf-8'))
STATE_PATH = BASE_DIR / CONFIG.get('watcher_state_file', 'watcher_state.json')
LOG_PATH = BASE_DIR / CONFIG.get('watcher_log_file', 'watcher.log')
DB_PATH = str(Path.home() / 'Library/Messages/chat.db')
POLL_SECONDS = 3
OWNER_SENDERS = {'+821030141521', 'hericobacter@live.com'}


def log(msg: str) -> None:
    ts = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    with LOG_PATH.open('a', encoding='utf-8') as f:
        f.write(f'[{ts}] {msg}\n')


def load_state() -> dict:
    if STATE_PATH.exists():
        return json.loads(STATE_PATH.read_text(encoding='utf-8'))
    return {'last_rowid': 0, 'last_started_at': None, 'last_event_at': None}


def save_state(state: dict) -> None:
    STATE_PATH.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding='utf-8')


def send_reply(to_value: str, text: str) -> None:
    cmd = [sys.executable, str(BASE_DIR / 'send_reply.py'), '--to', to_value, '--text', text]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or 'reply send failed')


def normalize_sender(sender: str) -> str:
    sender = (sender or '').strip()
    if sender.startswith('010') and len(sender) == 11:
        return '+82' + sender[1:]
    return sender


def fetch_new_messages(con: sqlite3.Connection, last_rowid: int) -> list[dict]:
    q = """
    SELECT
      message.ROWID as rowid,
      COALESCE(handle.id,'') as sender,
      COALESCE(message.text,'') as text,
      message.is_from_me as is_from_me,
      datetime(message.date/1000000000 + 978307200, 'unixepoch', 'localtime') as created_at
    FROM message
    LEFT JOIN handle ON handle.ROWID = message.handle_id
    WHERE message.ROWID > ?
    ORDER BY message.ROWID ASC
    """
    rows = con.execute(q, (last_rowid,)).fetchall()
    out = []
    for row in rows:
        out.append({
            'rowid': row[0],
            'sender': normalize_sender(row[1]),
            'text': row[2] or '',
            'is_from_me': int(row[3] or 0),
            'created_at': row[4],
        })
    return out


def main() -> int:
    assistant = Assistant(BASE_DIR)
    state = load_state()
    state['last_started_at'] = datetime.now().isoformat(timespec='seconds')
    if state.get('last_rowid') in (None, 0):
        con0 = sqlite3.connect(DB_PATH)
        cur = con0.execute('SELECT COALESCE(MAX(ROWID), 0) FROM message')
        state['last_rowid'] = int(cur.fetchone()[0] or 0)
        con0.close()
    save_state(state)
    log(f"starting poller last_rowid={state['last_rowid']}")

    con = sqlite3.connect(DB_PATH)
    try:
        while True:
            new_messages = fetch_new_messages(con, int(state.get('last_rowid') or 0))
            for msg in new_messages:
                state['last_rowid'] = msg['rowid']
                text = (msg['text'] or '').strip()
                sender = msg['sender']
                if not text:
                    save_state(state)
                    continue

                # Self-test messages in macOS DB often appear as is_from_me=1.
                # Allow owner-originated self-test messages, but avoid loops by skipping assistant-tagged replies.
                if text.startswith('[자비스 테스트]'):
                    save_state(state)
                    continue

                if msg['is_from_me'] and sender not in OWNER_SENDERS:
                    save_state(state)
                    continue

                log(f"polled sender={sender} is_from_me={msg['is_from_me']} text={text}")
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
    finally:
        con.close()


if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except KeyboardInterrupt:
        raise SystemExit(0)
