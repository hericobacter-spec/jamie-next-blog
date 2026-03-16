#!/usr/bin/env bash
# Wrapper to run the Python job. Expects TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in the environment.
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# Prefer project venv python (has required deps), fallback to system python3
if [ -x "/Users/jamie/.venvs/daily-news/bin/python3" ]; then
  PYTHON="/Users/jamie/.venvs/daily-news/bin/python3"
else
  PYTHON="$(which python3 || true)"
fi
if [ -z "$PYTHON" ]; then
  echo "python3 not found. Install Python 3 and try again." >&2
  exit 2
fi

# Load .env from script dir if present (export variables)
ENV_FILE="$SCRIPT_DIR/.env"
if [ -f "$ENV_FILE" ]; then
  # export variables from .env
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

if [ -z "${TELEGRAM_BOT_TOKEN:-}" ] || [ -z "${TELEGRAM_CHAT_ID:-}" ]; then
  echo "TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID must be set in environment or $ENV_FILE" >&2
  exit 3
fi

exec "$PYTHON" "$SCRIPT_DIR/daily_korean_news.py"
