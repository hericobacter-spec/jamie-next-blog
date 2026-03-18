#!/usr/bin/env bash
# precheck.sh - Print required pre-checks for blog tasks
set -euo pipefail
printf "pwd: %s\n" "$(pwd)"
printf "branch: %s\n" "$(git rev-parse --abbrev-ref HEAD)"
printf "git status --short:\n"
git status --short || true
printf "tracked node_modules files (should be none):\n"
git ls-files | grep "^node_modules/" || true
