This package provides a scheduled job that fetches the top Google News (Korea, Korean) headlines, summarizes the top 10 items (2-3 sentences each) with links, and sends the result to a Telegram chat.

Files:
- run_daily_korean_news.sh  -> wrapper that runs the Python script (expects env vars set)
- daily_korean_news.py      -> Python script that fetches top news, extracts short summaries, and sends to Telegram

Installation (one-time, requires user approval):
1) Place these files on the host where they should run (already in workspace).
2) Install Python dependencies: requests, beautifulsoup4
   pip3 install requests beautifulsoup4
3) Configure environment variables (export or in a .env file):
   - TELEGRAM_BOT_TOKEN  (your bot token)
   - TELEGRAM_CHAT_ID    (destination chat id)
4) Create a cron entry to run at 09:00 Asia/Seoul daily. On a machine set to KST, add to crontab:
   0 9 * * * /path/to/daily-korean-news/run_daily_korean_news.sh >> /var/log/daily-korean-news.log 2>&1

First run: Next 09:00 KST is 2026-02-23 09:00 (based on current time 2026-02-22 18:25 KST). Ensure cron/launchd is enabled so the first run executes then.

Notes & limitations:
- This script uses the Google News RSS feed for Korea: https://news.google.com/rss?hl=ko&gl=KR&ceid=KR:ko
- Summaries are extracted heuristically from the article's main paragraphs — not AI-generated. They are short (2-3 sentences) but may be imperfect. For higher-quality summaries, integrate an LLM API.
- The script requires outbound HTTP(s) access and the Telegram bot token to send messages.
- If you want the agent-managed solution (use OpenClaw subagent to run and use web_fetch/web_search and internal summarization), tell me and I will set that up instead.
