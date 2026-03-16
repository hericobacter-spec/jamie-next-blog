#!/usr/bin/env python3
"""
Polling-based Telegram callback_query handler (updated).
- view_all: sends image (/tmp/calendar_table_full.png) if exists, otherwise text summary
- notify_settings: replies with interactive options and persists choice
"""
import os, time, json, urllib.request, urllib.parse, subprocess
ENV='/Users/jamie/.openclaw/workspace/daily-korean-news/.env'
# load env
if os.path.exists(ENV):
    with open(ENV) as f:
        for line in f:
            if '=' in line:
                k,v=line.strip().split('=',1)
                os.environ[k]=v
BOT=os.environ.get('TELEGRAM_BOT_TOKEN')
CHAT=os.environ.get('TELEGRAM_CHAT_ID')
if not BOT:
    print('TELEGRAM_BOT_TOKEN not set; exiting')
    raise SystemExit(1)
API_BASE=f'https://api.telegram.org/bot{BOT}'
OFFSET_FILE='/tmp/telegram_poll_offset.txt'
POLL_INTERVAL=2
SETTINGS_FILE='/Users/jamie/.openclaw/workspace/daily-schedule/settings.json'


def get_updates(offset=None, timeout=10):
    url=f"{API_BASE}/getUpdates?timeout={timeout}"
    if offset:
        url += f"&offset={offset}"
    try:
        with urllib.request.urlopen(url, timeout=timeout+5) as r:
            data=json.load(r)
            return data
    except Exception as e:
        print('getUpdates error', e)
        return None

def answer_callback(query_id, text=''):
    url=f"{API_BASE}/answerCallbackQuery"
    payload={'callback_query_id': query_id, 'text': text}
    data=json.dumps(payload).encode('utf-8')
    req=urllib.request.Request(url, data=data, headers={'Content-Type':'application/json'})
    try:
        urllib.request.urlopen(req)
    except Exception as e:
        print('answerCallbackQuery error', e)

def send_message(chat_id, text):
    url=f"{API_BASE}/sendMessage"
    payload={'chat_id': chat_id, 'text': text}
    data=json.dumps(payload).encode('utf-8')
    req=urllib.request.Request(url, data=data, headers={'Content-Type':'application/json'})
    try:
        with urllib.request.urlopen(req) as r:
            return json.load(r)
    except Exception as e:
        print('sendMessage error', e)
        return None

def send_photo(chat_id, photo_path, caption=None):
    # use multipart/form-data via curl for simplicity
    if not os.path.exists(photo_path):
        return send_message(chat_id, caption or '이미지가 없습니다.')
    cmd = [
        '/usr/bin/env','bash','-lc',
        f"set -o allexport; source {ENV} >/dev/null 2>&1 || true; export LANG=ko_KR.UTF-8 LC_ALL=ko_KR.UTF-8; curl -sS -X POST '{API_BASE}/sendPhoto' -F chat_id='{chat_id}' -F photo=@{photo_path} --form-string \"caption={caption or ''}\""
    ]
    try:
        out = subprocess.check_output(cmd, stderr=subprocess.STDOUT, text=True)
        try:
            return json.loads(out.strip().splitlines()[-1])
        except Exception:
            return {'ok':False,'raw':out}
    except subprocess.CalledProcessError as e:
        print('send_photo error', e.output)
        return {'ok':False,'error':str(e)}

# helper: produce 7-day summary using icalBuddy or calendar_read.py
def produce_7day_text():
    try:
        out = subprocess.check_output(['/opt/homebrew/bin/icalBuddy','eventsToday+6'], text=True)
        if out.strip():
            return '[다음 7일] 일정 요약\n\n' + out
    except Exception:
        pass
    try:
        start = subprocess.check_output(['date','+%Y-%m-%d'], text=True).strip()
        end = subprocess.check_output(['date','-v+7d','+%Y-%m-%d'], text=True).strip()
        out = subprocess.check_output(['/usr/bin/env','python3','daily-schedule/calendar_read.py', start, end], text=True)
        return '[다음 7일] 일정 요약\n\n' + out
    except Exception as e:
        return '[다음 7일] 일정 요약\n\n오류로 인해 일정을 불러올 수 없습니다.'

# settings persistence
def load_settings():
    try:
        import json
        return json.load(open(SETTINGS_FILE))
    except Exception:
        return {}

def save_settings(d):
    try:
        import json
        json.dump(d, open(SETTINGS_FILE,'w'), ensure_ascii=False, indent=2)
    except Exception as e:
        print('save_settings error', e)


def handle_callback(q):
    data=q.get('data')
    query_id=q.get('id')
    from_id=q.get('from',{}).get('id')
    message=q.get('message')
    chat_id = (message or {}).get('chat',{}).get('id') or from_id
    if not data:
        answer_callback(query_id, '알 수 없는 명령')
        return
    if data == 'view_all':
        answer_callback(query_id, '전체 일정을 전송합니다...')
        # prefer image if available
        img_path = '/tmp/calendar_table_full.png'
        if os.path.exists(img_path):
            send_photo(chat_id, img_path, caption='다음 7일 일정(표 이미지)')
        else:
            txt = produce_7day_text()
            send_message(chat_id, txt)
    elif data == 'notify_settings':
        answer_callback(query_id, '알림 설정 메뉴를 보냅니다.')
        settings = load_settings()
        cur = settings.get(str(chat_id),'15min')
        text = f'현재 알림 설정: {cur}\n원하는 옵션을 선택하세요.'
        # send inline keyboard with options
        kb = {
            'inline_keyboard': [
                [ {'text':'전체 켬','callback_data':'notify_all'}, {'text':'15분 전','callback_data':'notify_15'} ],
                [ {'text':'끄기','callback_data':'notify_off'} ]
            ]
        }
        payload = {'chat_id': chat_id, 'text': text, 'reply_markup': kb}
        url=f"{API_BASE}/sendMessage"
        data=json.dumps(payload, ensure_ascii=False).encode('utf-8')
        req=urllib.request.Request(url, data=data, headers={'Content-Type':'application/json'})
        try:
            with urllib.request.urlopen(req) as r:
                pass
        except Exception as e:
            print('sendMessage with keyboard error', e)
    elif data in ('notify_all','notify_15','notify_off'):
        # persist choice per-chat
        choice_map = {'notify_all':'all','notify_15':'15min','notify_off':'off'}
        choice = choice_map.get(data,'15min')
        settings = load_settings()
        settings[str(chat_id)] = choice
        save_settings(settings)
        answer_callback(query_id, f'알림 설정이 "{choice}"(으)로 저장되었습니다.')
        send_message(chat_id, f'새 알림 설정: {choice}')
    else:
        answer_callback(query_id, '알 수 없는 명령')


def main():
    offset=0
    if os.path.exists(OFFSET_FILE):
        try:
            offset=int(open(OFFSET_FILE).read().strip())
        except Exception:
            offset=0
    while True:
        data=get_updates(offset=offset, timeout=20)
        if not data:
            time.sleep(POLL_INTERVAL)
            continue
        if not data.get('ok'):
            time.sleep(POLL_INTERVAL)
            continue
        for upd in data.get('result',[]):
            offset = max(offset, upd.get('update_id',0)+1)
            open(OFFSET_FILE,'w').write(str(offset))
            # handle callback_query
            if 'callback_query' in upd:
                handle_callback(upd['callback_query'])
        time.sleep(POLL_INTERVAL)

if __name__=='__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('exiting')
