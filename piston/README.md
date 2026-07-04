# Self-Hosted Piston — Club 404 AU Playground

This directory contains the Docker Compose setup to run your own [Piston](https://github.com/engineer-man/piston) code execution engine.

## Production Deployment (Vercel)

The playground uses a **Vercel serverless function** (`client/api/piston/execute.js`) as a proxy to your Piston server. This keeps the Piston URL secret and avoids CORS issues.

### Deploy Piston on a Free VPS

```bash
# SSH into your Oracle Cloud Always Free instance (Ubuntu 22.04/24.04)
ssh ubuntu@YOUR_PUBLIC_IP

# Run the deployment script from the project root
bash deploy-piston.sh

# Install all required languages
bash install-languages.sh
```

### Configure Vercel

1. Go to your Vercel project → **Settings → Environment Variables**
2. Add: `PISTON_API_URL` = `http://YOUR_VPS_PUBLIC_IP`
3. Redeploy your Vercel project

### How It Works

```
Browser → Vercel (/api/piston/execute) → Your VPS (Piston API)
```

- **Development**: Vite proxies `/api/piston/execute` → `localhost:2000/api/v2/execute`
- **Production**: Vercel serverless function reads `PISTON_API_URL` env var and forwards requests

## Local Development

```bash
cd piston
docker compose up -d
# Wait 5s, then install languages via Piston CLI or the install script
```

In `client/.env`:
```
VITE_PISTON_EXEC_URL=/api/piston/execute
```

## Managing the Container

```bash
# View logs
docker compose logs -f

# Stop Piston
docker compose down

# Restart Piston
docker compose restart

# Remove everything (including installed runtimes)
docker compose down -v
```

## Troubleshooting

**Container won't start:**
- Ensure Docker is running
- Ensure port `80` is open in your VPS firewall/security list
- Check logs: `docker compose logs piston`

**Code execution fails:**
- Check if runtimes are installed: `curl http://YOUR_IP/api/v2/runtimes`
- Re-run `install-languages.sh`

**Out of memory:**
- Piston can be memory-heavy with all runtimes installed
- Oracle Cloud Always Free gives 24GB RAM — more than enough
