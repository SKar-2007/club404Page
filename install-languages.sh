#!/usr/bin/env bash
# =============================================================================
# Install all required languages for Club 404 AU Playground
# Run this ONCE after deploying Piston
# =============================================================================

set -euo pipefail

PISTON_DIR="$HOME/piston-server"
cd "$PISTON_DIR"

echo "Installing all required language runtimes for Club 404 AU Playground..."
echo ""

LANGUAGES=(
  "c"
  "c++"
  "java"
  "go"
  "ruby"
  "typescript"
  "php"
  "lua"
  "rust"
)

for lang in "${LANGUAGES[@]}"; do
  echo "Installing $lang..."
  docker compose exec -T piston /piston/packages/packages.sh install "$lang" 2>/dev/null || \
    echo "  ⚠️  Failed to install $lang (may already be installed or unavailable)"
done

echo ""
echo "Installed runtimes:"
curl -s http://localhost/api/v2/runtimes | python3 -m json.tool 2>/dev/null || \
  curl -s http://localhost/api/v2/runtimes

echo ""
echo "Done! All languages installed."
