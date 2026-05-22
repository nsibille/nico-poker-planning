#!/bin/bash
# Session start hook for Claude Code on the web.
# - Installs npm dependencies so lint/build/dev work
# - Applies pending Supabase migrations (idempotent — skipped if credentials
#   are not configured)
set -euo pipefail

# Only run in the managed remote environment. Local sessions don't need this.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

echo "[session-start] npm install …"
npm install --no-audit --no-fund --silent

echo "[session-start] apply migrations …"
node scripts/apply-migrations.mjs
