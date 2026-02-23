#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

INTERVAL=${1:-120}

echo "Auto-push watcher started (every ${INTERVAL}s)"
echo "Press Ctrl+C to stop"
echo ""

while true; do
  if ! git diff --quiet HEAD 2>/dev/null || [ -n "$(git ls-files --others --exclude-standard)" ]; then
    CHANGED=$(git diff --name-only HEAD 2>/dev/null; git ls-files --others --exclude-standard)
    FILE_COUNT=$(echo "$CHANGED" | grep -c . || true)
    TIMESTAMP=$(date +"%b %d, %I:%M %p")

    git add -A
    git commit -m "Auto-save: $FILE_COUNT file(s) — $TIMESTAMP"
    git push origin main
    echo "[$(date +%H:%M:%S)] Pushed $FILE_COUNT file(s)"
  else
    echo "[$(date +%H:%M:%S)] No changes"
  fi
  sleep "$INTERVAL"
done
