#!/bin/bash
# Club 404 AU — Piston Code Execution Engine Setup
# This script starts a self-hosted Piston instance and installs language runtimes.

set -e

echo "╔══════════════════════════════════════════╗"
echo "║  Club 404 AU — Piston Setup              ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "✗ Docker is not installed. Please install Docker first."
    echo "  https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    echo "✗ Docker Compose is not available. Please install Docker Compose."
    exit 1
fi

cd "$(dirname "$0")"

echo "▶ Starting Piston API container..."
docker compose up -d

echo "⏳ Waiting for Piston API to be ready..."
for i in $(seq 1 30); do
    if curl -s http://localhost:2000/api/v2/runtimes > /dev/null 2>&1; then
        echo "✓ Piston API is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "✗ Piston API failed to start after 30 seconds."
        echo "  Check logs: docker compose logs piston-api"
        exit 1
    fi
    sleep 1
done

echo ""
echo "▶ Installing language runtimes..."

# Clone Piston CLI if not present
if [ ! -d "piston-cli" ]; then
    echo "  Cloning Piston CLI..."
    git clone --depth 1 https://github.com/engineer-man/piston.git piston-cli 2>/dev/null || true
fi

cd piston-cli/cli
npm install --silent 2>/dev/null

echo "  Installing C..."
node index.js ppman install c 2>/dev/null || echo "  ⚠ C install failed"

echo "  Installing C++..."
node index.js ppman install c++ 2>/dev/null || echo "  ⚠ C++ install failed"

echo "  Installing Java..."
node index.js ppman install java 2>/dev/null || echo "  ⚠ Java install failed"

echo "  Installing Go..."
node index.js ppman install go 2>/dev/null || echo "  ⚠ Go install failed"

echo "  Installing Ruby..."
node index.js ppman install ruby 2>/dev/null || echo "  ⚠ Ruby install failed"

echo "  Installing TypeScript..."
node index.js ppman install typescript 2>/dev/null || echo "  ⚠ TypeScript install failed"

echo "  Installing PHP..."
node index.js ppman install php 2>/dev/null || echo "  ⚠ PHP install failed"

echo "  Installing Lua..."
node index.js ppman install lua 2>/dev/null || echo "  ⠠ Lua install failed"

echo "  Installing Rust..."
node index.js ppman install rust 2>/dev/null || echo "  ⚠ Rust install failed"

cd ../..

echo ""
echo "▶ Verifying installed runtimes..."
RUNTIMES=$(curl -s http://localhost:2000/api/v2/runtimes)
echo "$RUNTIMES" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    for r in data:
        print(f\"  ✓ {r['language']} {r['version']}\")
except:
    print('  Could not parse runtimes')
" 2>/dev/null || echo "  Could not verify runtimes"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║  Setup Complete!                          ║"
echo "║                                          ║"
echo "║  Piston API: http://localhost:2000        ║"
echo "║                                          ║"
echo "║  Update PISTON_API_URL in your .env:     ║"
echo "║  VITE_PISTON_API_URL=http://localhost:2000║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "To stop Piston: cd piston && docker compose down"
echo "To view logs:   cd piston && docker compose logs -f"
