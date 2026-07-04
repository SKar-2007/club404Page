#!/usr/bin/env bash
# =============================================================================
# Piston API — Free Production Deployment Script
# Deploy Piston on Oracle Cloud Always Free Tier (or any Ubuntu VPS)
# =============================================================================
#
# PREREQUISITES:
#   1. Create an Oracle Cloud Always Free account: https://cloud.oracle.com/free
#   2. Create an ARM instance (Ubuntu 22.04/24.04, 4 OCPU, 24GB RAM — FREE)
#   3. SSH into your instance: ssh ubuntu@<YOUR_PUBLIC_IP>
#   4. Run this script: bash deploy-piston.sh
#
# AFTER DEPLOYMENT:
#   1. Note the output URL (e.g., http://YOUR_IP)
#   2. In Vercel dashboard → Settings → Environment Variables:
#      - Add: PISTON_API_URL = http://YOUR_IP
#   3. Redeploy your Vercel project
#
# =============================================================================

set -euo pipefail

echo "============================================"
echo "  Piston API — Production Deployment Script"
echo "============================================"
echo ""

# --- 1. System updates ---
echo "[1/6] Updating system packages..."
sudo apt-get update -qq
sudo apt-get upgrade -y -qq

# --- 2. Install Docker ---
echo "[2/6] Installing Docker..."
if ! command -v docker &> /dev/null; then
  curl -fsSL https://get.docker.com | sudo sh
  sudo usermod -aG docker "$USER"
  echo "  Docker installed. You may need to log out and back in for group changes."
else
  echo "  Docker already installed."
fi

# --- 3. Install Docker Compose ---
echo "[3/6] Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
  sudo apt-get install -y docker-compose-plugin
else
  echo "  Docker Compose already installed."
fi

# --- 4. Create project directory ---
echo "[4/6] Setting up Piston project..."
PISTON_DIR="$HOME/piston-server"
mkdir -p "$PISTON_DIR"
cd "$PISTON_DIR"

# --- 5. Create docker-compose.yml ---
echo "[5/6] Creating docker-compose.yml..."
cat > docker-compose.yml <<'EOF'
version: "3.8"

services:
  piston:
    image: ghcr.io/engineer-man/piston
    restart: always
    privileged: true
    volumes:
      - ./piston_data:/piston/data

  caddy:
    image: caddy:latest
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - piston

volumes:
  caddy_data:
  caddy_config:
EOF

# --- 6. Create Caddyfile with CORS + security headers ---
echo "[6/6] Creating Caddyfile..."
cat > Caddyfile <<'EOF'
{
  servers {
    timeouts {
      read_body   30s
      read_header 5s
      write       30s
      idle        30s
    }
  }
}

:80 {
  # Compression
  encode zstd gzip

  # Security + CORS headers
  header {
    Access-Control-Allow-Origin *
    Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Access-Control-Allow-Headers "Content-Type, Authorization"
    Access-Control-Max-Age "7200"
    X-Frame-Options "DENY"
    X-Content-Type-Options "nosniff"
    -Server
  }

  # Limit payload size
  request_body {
    max_size 50k
  }

  # Handle CORS preflight
  @options {
    method OPTIONS
  }
  respond @options "" 204

  # Proxy to Piston
  handle {
    reverse_proxy piston:2000 {
      header_up X-Real-IP {remote_host}
    }
  }
}
EOF

echo ""
echo "============================================"
echo "  Deployment Complete!"
echo "============================================"
echo ""
echo "  Starting Piston + Caddy..."
echo ""

docker compose up -d

echo ""
echo "  Testing Piston API..."
sleep 5

if curl -s "http://localhost/api/v2/runtimes" > /dev/null 2>&1; then
  echo "  ✅ Piston API is running!"
else
  echo "  ⚠️  Piston may still be starting. Wait 30s and test manually:"
  echo "     curl http://localhost/api/v2/runtimes"
fi

# Get public IP
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s icanhazip.com 2>/dev/null || echo "YOUR_PUBLIC_IP")

echo ""
echo "============================================"
echo "  NEXT STEPS"
echo "============================================"
echo ""
echo "  1. Open port 80 in Oracle Cloud firewall:"
echo "     - Go to OCI Console → Networking → Virtual Cloud Networks"
echo "     - Click your VCN → Security Lists → Default Security List"
echo "     - Add Ingress Rule: Source 0.0.0.0/0, Port 80, TCP"
echo ""
echo "  2. Test your API:"
echo "     curl http://$PUBLIC_IP/api/v2/runtimes"
echo ""
echo "  3. Install languages (run inside $PISTON_DIR):"
echo "     docker compose exec piston /piston/packages/packages.sh install python"
echo "     docker compose exec piston /piston/packages/packages.sh install nodejs"
echo "     docker compose exec piston /piston/packages/packages.sh install c"
echo "     docker compose exec piston /piston/packages/packages.sh install c++"
echo "     docker compose exec piston /piston/packages/packages.sh install java"
echo "     docker compose exec piston /piston/packages/packages.sh install go"
echo "     docker compose exec piston /piston/packages/packages.sh install ruby"
echo "     docker compose exec piston /piston/packages/packages.sh install typescript"
echo "     docker compose exec piston /piston/packages/packages.sh install php"
echo "     docker compose exec piston /piston/packages/packages.sh install lua"
echo "     docker compose exec piston /piston/packages/packages.sh install rust"
echo ""
echo "  4. Set Vercel environment variable:"
echo "     PISTON_API_URL=http://$PUBLIC_IP"
echo ""
echo "  5. Redeploy your Vercel project"
echo ""
echo "  Your Piston API base URL: http://$PUBLIC_IP"
echo "  Runtimes endpoint: http://$PUBLIC_IP/api/v2/runtimes"
echo "  Execute endpoint:  http://$PUBLIC_IP/api/v2/execute"
echo ""
echo "============================================"
