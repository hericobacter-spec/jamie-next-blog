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
WATCHER_STATE = BASE_DIR / CONFIG.get('watcher_state_file', 'watcher_state.json')
WATCHER_LOG = BASE_DIR / CONFIG.get('watcher_log_file', 'watcher.log')
IMSG_PATH = CONFIG.get('imsg_path', '/opt/homebrew/bin/imsg')
DEBOUNCE = CONFIG.get('watch_debounce', '500ms')


def log(msg: str) -> None:
    ts = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    WATCHER_LOG.parent.mkdir(parents=True, exist_ok=True)
    with WATCHER_LOG.open('a', encoding='utf-8') as f:
        f.write(f'[{ts}] {msg}\n')


def load_state() -> dict:
    if WATCHER_STATE.exists():
        return json.loads(WATCHER_STATE.read_text(encoding='utf-8'))
    return {'last_rowid': None, 'last_started_at': None, 'last_event_at': None}


def save_state(state: dict) -> None:
    WATCHER_STATE.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding='utf-8')


def send_reply(to_number: str, text: str) -> None:
    cmd = [sys.executable, str(BASE_DIR / 'send_reply.py'), '--to', to_number, '--text', text]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or 'reply send failed')


def normalize_sender(event: dict) -> str:
    sender = (event.get('sender') or event.get('identifier') or '').strip()
    if sender.startswith('010') and len(sender) == 11:
        return '+82' + sender[1:]
    return sender


def main() -> int:
    assistant = Assistant(BASE_DIR)
    state = load_state()
    state['last_started_at'] = datetime.now().isoformat(timespec='seconds')
    save_state(state)

    cmd = [IMSG_PATH, 'watch', '--json', '--debounce', DEBOUNCE]
    if state.get('last_rowid'):
        cmd.extend(['--since-rowid', str(state['last_rowid'])])

    log('starting watcher: ' + ' '.join(cmd))
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    while True:
        line = proc.stdout.readline() if proc.stdout else ''
        if not line:
            err = ''
            if proc.stderr:
                try:
                    err = proc.stderr.read().strip()
                except Exception:
                    err = ''
            log(f'watcher stopped rc={proc.poll()} err={err}')
            return 1

        line = line.strip()
        if not line:
            continue

        try:
            event = json.loads(line)
        except Exception:
            log('non-json line: ' + line[:300])
            continue

        rowid = event.get('rowid') or event.get('message_rowid') or event.get('id')
        if rowid:
            state['last_rowid'] = rowid

        if event.get('is_from_me'):
            save_state(state)
            continue

        sender = normalize_sender(event)
        text = (event.get('text') or '').strip()
        if not sender or not text:
            save_state(state)
            continue

        log(f'inbound sender={sender} text={text}')
        reply = assistant.handle_message(sender, text)
        state['last_event_at'] = datetime.now().isoformat(timespec='seconds')
        save_state(state)

        if reply.action == 'sender_not_allowed':
            log(f'ignored sender={sender}')
            continue

        reply_text = reply.text
        owner_senders = {'+821030141521', 'hericobacter@live.com'}
        if sender in owner_senders:
            reply_text = f'[자비스 테스트] {reply_text}'

        try:
            send_reply(sender, reply_text)
            log(f'replied sender={sender} action={reply.action}')
        except Exception as e:
            log(f'reply failed sender={sender} action={reply.action} error={e}')

        time.sleep(0.3)


if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except KeyboardInterrupt:
        raise SystemExit(0)
