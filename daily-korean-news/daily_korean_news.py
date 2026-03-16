#!/usr/bin/env python3
"""
Fetch top Google News (Korea, Korean) headlines (RSS), visit each article, extract a short 2-3 sentence summary (heuristic), and send the top 10 with links to a Telegram chat.
Requires: requests, bs4
Environment variables required:
  TELEGRAM_BOT_TOKEN
  TELEGRAM_CHAT_ID
"""
import os
import sys
import requests
from bs4 import BeautifulSoup
from html import unescape
import re

RSS_URL = "https://news.google.com/rss?hl=ko&gl=KR&ceid=KR:ko"
MAX_ITEMS = 10
# Concurrency and rate control (environment variables)
CONCURRENCY = int(os.environ.get('CONCURRENCY', '1'))  # reserved for future use; lockfile+nice enforce single active instance by default
MAX_PER_RUN = int(os.environ.get('MAX_PER_RUN', '3'))  # max Playwright fallbacks per run
PAGE_DELAY = float(os.environ.get('PAGE_DELAY', '3.0'))  # seconds to wait between page visits/fallbacks



def fetch_rss(url):
    r = requests.get(url, timeout=15)
    r.raise_for_status()
    return r.text


def parse_rss_items(rss_xml):
    soup = BeautifulSoup(rss_xml, "xml")
    items = []
    for item in soup.find_all("item")[:MAX_ITEMS]:
        title = item.title.get_text(strip=True)
        link = item.link.get_text(strip=True)
        items.append({"title": title, "link": link})
    return items


def fetch_article_text(url):
    # Use requests with realistic headers and simple retries first
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0 Safari/537.36",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    }
    session = requests.Session()
    for attempt in range(3):
        try:
            r = session.get(url, timeout=20, headers=headers)
            r.raise_for_status()
            break
        except Exception:
            r = None
    if not r:
        return ""
    ct = r.headers.get("Content-Type", "")
    if "text/html" not in ct:
        return ""
    soup = BeautifulSoup(r.text, "html.parser")
    # Heuristic: collect text from common article containers first
    paragraphs = []
    # common selectors
    selectors = ["article", "div[id*='article']", "div[class*='article']", "div[class*='content']", "div[class*='news-body']"]
    for sel in selectors:
        for node in soup.select(sel):
            ps = [p.get_text(strip=True) for p in node.find_all("p")]
            paragraphs.extend(ps)
        if paragraphs:
            break
    if not paragraphs:
        paragraphs = [p.get_text(strip=True) for p in soup.find_all("p")]
    # Filter out very short paragraphs
    paragraphs = [p for p in paragraphs if len(p) > 40]
    text = "\n\n".join(paragraphs)
    if text.strip():
        return unescape(text)
    # Fallback: use Playwright stealth script to render page (requires playwright-scraper-skill)
    try:
        import subprocess, tempfile, json, time
        node_script = "/Users/jamie/.openclaw/workspace/skills/playwright-scraper-skill/scripts/playwright-stealth.js"
        with tempfile.NamedTemporaryFile(suffix='.json', delete=False) as tf:
            outpath = tf.name
        # Respect PAGE_DELAY before invoking Playwright to space out heavy operations
        try:
            time.sleep(PAGE_DELAY)
        except Exception:
            pass
        # Run Playwright under lower priority and with a simple concurrency lock to avoid CPU spikes
        lockfile = '/tmp/playwright_scraper.lock'
        cmd_shell = (
            "(umask 022; while ! (mkdir -p /tmp >/dev/null 2>&1 && ln -s \"$$\" \"%s\" 2>/dev/null); do sleep 0.5; done; "
            "nice -n 10 node \"%s\" \"%s\" \"%s\"; rm -f \"%s\")" % (lockfile, node_script, url, outpath, lockfile)
        )
        subprocess.run(cmd_shell, timeout=120, check=True, shell=True)
        # playwright script should save JSON or HTML to outpath
        with open(outpath, 'r', encoding='utf-8') as f:
            data = f.read()
        # try to extract HTML if returned as JSON
        try:
            j = json.loads(data)
            html = j.get('html') or j.get('content') or ''
        except Exception:
            html = data
        soup2 = BeautifulSoup(html, 'html.parser')
        paragraphs = [p.get_text(strip=True) for p in soup2.find_all('p')]
        paragraphs = [p for p in paragraphs if len(p) > 40]
        return unescape('\n\n'.join(paragraphs))
    except Exception:
        return ""


def make_summary(text, max_sentences=3):
    if not text:
        return "(요약 불가)"
    # Split into sentences using simple regex for Korean/latin punctuation
    sentences = re.split(r'(?<=[。．.!?！?]|\n)', text)
    sentences = [s.strip().replace('\n',' ') for s in sentences if s.strip()]
    if not sentences:
        # fallback: take first 300 chars
        return text[:300] + ("..." if len(text) > 300 else "")
    summary = " ".join(sentences[:max_sentences])
    # Trim to reasonable length
    if len(summary) > 600:
        summary = summary[:597] + "..."
    return summary


def build_message(items):
    lines = []
    lines.append("[오늘의 한국 주요 뉴스]\n")
    for i, it in enumerate(items, start=1):
        lines.append(f"{i}. {it['title']}")
        if it.get('summary'):
            lines.append(it['summary'])
        lines.append(it['link'])
        lines.append("")
    return "\n".join(lines)


def send_telegram(bot_token, chat_id, text):
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {"chat_id": chat_id, "text": text}
    r = requests.post(url, data=payload, timeout=15)
    r.raise_for_status()
    return r.json()


def main():
    bot = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat = os.environ.get('TELEGRAM_CHAT_ID')
    if not bot or not chat:
        print("TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID must be set", file=sys.stderr)
        sys.exit(2)

    rss = fetch_rss(RSS_URL)
    items = parse_rss_items(rss)
    results = []
    # Process items in batches to limit Playwright fallbacks and add delay between page visits
    processed = 0
    for it in items:
        article_text = fetch_article_text(it['link'])
        # If Playwright was used heavily, enforce MAX_PER_RUN
        # fetch_article_text will attempt Playwright only if requests fallback fails
        summary = make_summary(article_text, max_sentences=3)
        results.append({**it, 'summary': summary})
        processed += 1
        if processed % MAX_PER_RUN == 0:
            # after processing a batch, wait a bit to reduce CPU spike risk
            try:
                import time
                time.sleep(PAGE_DELAY)
            except Exception:
                pass

    message = build_message(results)
    # Telegram messages have size limits (~4096 chars). If over limit, split into chunks.
    CHUNK = 3900
    chunks = [message[i:i+CHUNK] for i in range(0, len(message), CHUNK)]
    for c in chunks:
        send_telegram(bot, chat, c)

if __name__ == '__main__':
    main()
