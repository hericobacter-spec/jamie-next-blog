#!/usr/bin/env python3
"""
Alert dispatcher: run periodically (e.g., every 5 minutes) to send notifications for events starting within the next 15 minutes.
- Uses the same conservative parser as run_daily_schedule.sh to avoid missed events
- Respects per-chat settings.json (all|15min|off)
- Maintains a small persistent cache (/tmp/daily_alerts_cache.json) to avoid duplicate alerts
"""
import os, sys, subprocess, json, datetime, time, urllib.request, re
ENV='/Users/jamie/.openclaw/workspace/daily-korean-news/.env'
SETTINGS_FILE='/Users/jamie/.openclaw/workspace/daily-schedule/settings.json'
CACHE_FILE='/tmp/daily_alerts_cache.json'
# load env
if os.path.exists(ENV):
    with open(ENV) as f:
        for line in f:
            if '=' in line:
                k,v=line.strip().split('=',1)
                os.environ[k]=v
BOT=os.environ.get('TELEGRAM_BOT_TOKEN')
CHAT=os.environ.get('TELEGRAM_CHAT_ID')
if not BOT or not CHAT:
    print('Missing TELEGRAM_BOT_TOKEN/CHAT; exiting')
    sys.exit(0)
API_BASE=f'https://api.telegram.org/bot{BOT}'
# load settings
try:
    settings=json.load(open(SETTINGS_FILE))
except Exception:
    settings={}
mode=settings.get(str(CHAT),'all')
if mode=='off':
    print('Notifications off for chat',CHAT)
    sys.exit(0)
if mode not in ('all','15min'):
    pass
# load cache
try:
    cache=json.load(open(CACHE_FILE))
except Exception:
    cache={}
# remove old entries (>24h)
now=datetime.datetime.now()
for k,v in list(cache.items()):
    ts=datetime.datetime.fromisoformat(v.get('ts')) if v.get('ts') else None
    if not ts or (now - ts).total_seconds() > 24*3600:
        cache.pop(k,None)
# query next 16 minutes
end = now + datetime.timedelta(minutes=16)
start_str = now.strftime('%Y-%m-%d %H:%M')
end_str = end.strftime('%Y-%m-%d %H:%M')
raw=''
# try icalBuddy first, fallback to calendar_read.py
ICAL='/opt/homebrew/bin/icalBuddy'
if os.path.exists(ICAL):
    try:
        raw = subprocess.check_output([ICAL, f'eventsFrom:{start_str}', f'to:{end_str}'], text=True)
    except Exception:
        raw=''
if not raw.strip():
    try:
        raw = subprocess.check_output(['/usr/bin/env','python3','daily-schedule/calendar_read.py', start_str, end_str], text=True)
    except Exception:
        raw=''
if not raw.strip():
    print('No upcoming events in next 16 minutes')
    # persist cache
    with open(CACHE_FILE,'w') as f: json.dump(cache,f)
    sys.exit(0)
# save raw for debug
open(f'/tmp/ical_alert_raw_{now.strftime("%Y%m%d_%H%M%S")}.txt','w').write(raw)
# conservative parser similar to run_daily_schedule
lines=[l for l in raw.splitlines() if l.strip()]
blocks=[]
cur=[]
for ln in lines:
    if ln.startswith('•'):
        if cur:
            blocks.append('\n'.join(cur))
        cur=[ln]
    else:
        if cur:
            cur.append(ln)
if cur: blocks.append('\n'.join(cur))
# also handle calendar_read.py '||' format
if not blocks and '||' in raw:
    blocks = [b.strip() for b in raw.split('\n') if b.strip()]
# parse blocks
events=[]
for b in blocks:
    title=''
    loc=''
    date=None
    start_time=''
    end_time=''
    lines=b.splitlines()
    # title
    title_line=lines[0]
    title=re.sub(r'^•\s*','',title_line).strip()
    title=re.sub(r'\s*\(.*@.*\)$','',title).strip()
    for ln in lines[1:]:
        ln=ln.strip()
        if ln.lower().startswith('location:'):
            loc=ln.split(':',1)[1].strip()
        # absolute date with time
        m=re.search(r'(\d{4})[.\-]\s*(\d{1,2})[.\-]\s*(\d{1,2}).*at\s*(오전|오후)?\s*(\d{1,2}):(\d{2})', ln)
        if m:
            y=int(m.group(1)); mo=int(m.group(2)); d=int(m.group(3))
            ap=m.group(4) or ''
            hh=int(m.group(5)); mm=int(m.group(6))
            if ap=='오후' and hh<12: hh+=12
            if ap=='오전' and hh==12: hh=0
            date=datetime.date(y,mo,d)
            start_time=f"{hh:02d}:{mm:02d}"
        rng=re.search(r'(today|tomorrow|day after tomorrow) at\s*(오전|오후)?\s*(\d{1,2}:\d{2}).*[-–].*(오전|오후)?\s*(\d{1,2}:\d{2})', ln, re.I)
        if rng:
            rel=rng.group(1).lower(); off=0
            if 'tomorrow' in rel: off=1
            if 'day after' in rel: off=2
            ap1=rng.group(2) or ''
            t1=rng.group(3)
            ap2=rng.group(4) or ''
            t2=rng.group(5)
            def conv(ap,t):
                hh=int(t.split(':')[0]); mm=t.split(':')[1]
                if ap=='오후' and hh<12: hh+=12
                if ap=='오전' and hh==12: hh=0
                return f"{hh:02d}:{mm}"
            start_time=conv(ap1,t1)
            end_time=conv(ap2,t2)
            date=datetime.date.today()+datetime.timedelta(days=off)
        # calendar_read '||' format
        if '||' in b:
            parts=b.split('||')
            if len(parts)>=4:
                # parts: cal||datestr||title||loc
                datestr=parts[1].strip()
                title=parts[2].strip()
                loc=parts[3].strip()
                m2=re.search(r'(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일.*(오전|오후)?\s*(\d{1,2}):(\d{2})', datestr)
                if m2:
                    y=int(m2.group(1)); mo=int(m2.group(2)); d=int(m2.group(3)); ap=m2.group(4) or ''
                    hh=int(m2.group(5)); mm=int(m2.group(6))
                    if ap=='오후' and hh<12: hh+=12
                    if ap=='오전' and hh==12: hh=0
                    date=datetime.date(y,mo,d)
                    start_time=f"{hh:02d}:{mm:02d}"
    events.append({'date':date,'title':title,'start':start_time,'end':end_time,'loc':loc,'raw':b})
# for each event, if it's within next 16 minutes, send alert unless cached
sent=0
for e in events:
    if not e['date']:
        continue
    # build unique id
    uid=f"{e['title']}|{e['date'].isoformat()}|{e.get('start','')}"
    # check cache
    if uid in cache:
        continue
    # compute event datetime
    if e.get('start'):
        hh,mm = map(int, e['start'].split(':'))
        ev_dt=datetime.datetime.combine(e['date'], datetime.time(hh,mm))
    else:
        # no start time -> skip
        continue
    # if event starts between now and end
    if now <= ev_dt <= end:
        # respect per-chat mode
        if mode=='15min' or mode=='all':
            # compose message
            times = e['start'] + (f"–{e['end']}" if e['end'] else '')
            icon = '💻' if re.search(r'webex|zoom|teams', e['loc'] or '', re.I) else '🏢'
            text = f"🔔 일정 알림 — 15분 전\n\n{times} {e['title']} _{icon} {e['loc']}_"
            payload = json.dumps({'chat_id': int(CHAT), 'text': text}, ensure_ascii=False).encode('utf-8')
            req = urllib.request.Request(f'{API_BASE}/sendMessage', data=payload, headers={'Content-Type':'application/json'})
            try:
                with urllib.request.urlopen(req, timeout=10) as r:
                    resp = r.read().decode()
                    print('sent alert', resp)
                    cache[uid]={'ts': now.isoformat()}
                    sent +=1
            except Exception as ex:
                print('send error', ex)
# persist cache
with open(CACHE_FILE,'w') as f:
    json.dump(cache,f)
print('done, sent', sent)
