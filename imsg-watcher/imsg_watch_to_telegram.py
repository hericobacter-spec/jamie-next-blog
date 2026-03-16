#!/usr/bin/env python3
"""Watch incoming iMessage/SMS via steipete/imsg and forward to Telegram.

- Uses: imsg watch --json
- Sends Telegram messages via Bot API.
- Scope: alert-only (no auto reply).

Env vars (loaded from daily-korean-news/.env):
- TELEGRAM_BOT_TOKEN
- TELEGRAM_CHAT_ID
Optional:
- IMSG_PATH (default: /Users/jamie/.local/bin/imsg)
- IMSG_WATCH_DEBOUNCE_MS (default: 500)

macOS requirements:
- Full Disk Access for the launching app (Terminal/launchd parent) to read chat.db
- Automation permission (Messages) needed only for sending, not for watch.
"""

import json
import os
import subprocess
import sys
import time
import urllib.request

def log_err(msg: str):
    try:
        ts = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime())
        with open('/tmp/imsg-watcher.debug.log', 'a', encoding='utf-8') as f:
            f.write(f'[{ts}] {msg}\n')
    except Exception:
        pass

ENV = '/Users/jamie/.openclaw/workspace/daily-korean-news/.env'


def load_env(path: str):
    if not os.path.exists(path):
        return
    with open(path) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#') or '=' not in line:
                continue
            k, v = line.split('=', 1)
            os.environ.setdefault(k, v)


def tg_send(text: str):
    bot = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat = os.environ.get('TELEGRAM_CHAT_ID')
    if not bot or not chat:
        raise RuntimeError('Missing TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID')
    url = f'https://api.telegram.org/bot{bot}/sendMessage'
    payload = json.dumps({'chat_id': chat, 'text': text}, ensure_ascii=False).encode('utf-8')
    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=10) as r:
        return r.read()


def main():
    load_env(ENV)

    imsg_path = os.environ.get('IMSG_PATH', '/Users/jamie/.local/bin/imsg')
    debounce = os.environ.get('IMSG_WATCH_DEBOUNCE_MS', '500')

    # Preflight: can we read chat list?
    try:
        pre = subprocess.run(
            [imsg_path, 'chats', '--limit', '1'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=10,
        )
        log_err(f"preflight chats rc={pre.returncode} stdout={pre.stdout.strip()[:120]} stderr={pre.stderr.strip()[:200]}")
    except Exception as e:
        log_err('preflight chats failed: ' + repr(e))

    # Start watcher
    cmd = [imsg_path, 'watch', '--json', '--debounce', str(debounce)]
    log_err('starting: ' + ' '.join(cmd))
    try:
        p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    except Exception as e:
        log_err('watcher start failed: ' + repr(e))
        # Avoid spamming; single error every 10 minutes
        last_err_sent_file = '/tmp/imsg-watcher.last_err_sent'
        try:
            now = int(time.time())
            last = 0
            if os.path.exists(last_err_sent_file):
                try:
                    last = int(open(last_err_sent_file).read().strip() or '0')
                except Exception:
                    last = 0
            if now - last >= 600:
                open(last_err_sent_file, 'w').write(str(now))
                tg_send('[iMessage Watcher] 오류: watcher 시작 실패: ' + str(e))
        except Exception:
            pass
        return 1

    # Startup note intentionally disabled to avoid spam when launchd restarts the watcher.

    # read JSONL
    last_err_sent_file = '/tmp/imsg-watcher.last_err_sent'

    def maybe_send_error(msg: str):
        """Send at most once per 10 minutes to avoid spam loops."""
        log_err('error: ' + msg)
        try:
            now = int(time.time())
            last = 0
            if os.path.exists(last_err_sent_file):
                try:
                    last = int(open(last_err_sent_file).read().strip() or '0')
                except Exception:
                    last = 0
            if now - last < 600:
                return
            open(last_err_sent_file, 'w').write(str(now))
            tg_send('[iMessage Watcher] 오류: ' + msg)
        except Exception:
            return

    while True:
        line = p.stdout.readline() if p.stdout else ''
        if not line:
            # process may have died; dump stderr and exit non-zero
            err = ''
            try:
                err = p.stderr.read() if p.stderr else ''
            except Exception:
                err = ''
            rc = p.poll()
            if err:
                maybe_send_error(f'watcher exited (rc={rc}) stderr=' + err[-900:])
            else:
                maybe_send_error(f'watcher exited (rc={rc}) with no stderr output')
            return 1

        line = line.strip()
        if not line:
            continue

        try:
            msg = json.loads(line)
        except Exception:
            continue

        # Only forward inbound messages
        if msg.get('is_from_me'):
            continue

        sender = msg.get('sender') or '(unknown)'
        text = (msg.get('text') or '').strip()
        created = msg.get('created_at') or ''

        # Short, safe forward
        out = f"[iMessage 수신] {created}\n- from: {sender}"
        if text:
            # avoid huge dumps
            if len(text) > 800:
                text = text[:800] + '…'
            out += f"\n- text: {text}"

        try:
            tg_send(out)
        except Exception:
            # if telegram send fails, keep watching
            pass


if __name__ == '__main__':
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        sys.exit(0)
