#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if ! git diff --quiet HEAD 2>/dev/null || [ -n "$(git ls-files --others --exclude-standard)" ]; then
  CHANGED=$(git diff --name-only HEAD 2>/dev/null; git ls-files --others --exclude-standard)
  FILE_COUNT=$(echo "$CHANGED" | grep -c . || true)

  if echo "$CHANGED" | grep -q "^src/pages/"; then
    SCOPE="pages"
  elif echo "$CHANGED" | grep -q "^src/components/"; then
    SCOPE="components"
  elif echo "$CHANGED" | grep -q "^src/services/"; then
    SCOPE="services"
  elif echo "$CHANGED" | grep -q "^src/"; then
    SCOPE="src"
  else
    SCOPE="project"
  fi

  MSG="${1:-Update $SCOPE ($FILE_COUNT file$([ "$FILE_COUNT" -ne 1 ] && echo 's'))}"

  git add -A
  git commit -m "$MSG"
  git push origin main
  echo "Pushed: $MSG"
else
  echo "Nothing to push — working tree is clean."
fi
