# Docker Setup - Linkea v2

## Prerequisites

- Docker Desktop
- Docker Compose v2+

## Quick Start

```bash
# 1. Copy environment file and configure
cp .env.example .env

# 2. Add these variables to your .env:
REDIS_CLIENT=predis
REDIS_HOST=redis
CACHE_STORE=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

# 3. Start all services
docker compose up -d

# 4. Install dependencies (first time only)
docker compose exec linkea.test composer install
docker compose exec linkea.test npm install

# 5. Run migrations
docker compose exec linkea.test php artisan migrate

# 6. Build frontend assets
docker compose exec linkea.test npm run build
```

## Services

| Service | Description | Port |
|---------|-------------|------|
| `linkea.test` | Main Laravel app | 8000 |
| `horizon` | Queue worker (Horizon) | - |
| `scheduler` | Cron/Scheduler | - |
| `redis` | Cache & Queue | 6379 |

## Useful Commands

```bash
# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f horizon
docker compose logs -f scheduler

# Access app container shell
docker compose exec linkea.test bash

# Run artisan commands
docker compose exec linkea.test php artisan <command>

# Restart Horizon after code changes
docker compose restart horizon

# Rebuild containers
docker compose build --no-cache
docker compose up -d
```

## Horizon Dashboard

Access Horizon at: `http://localhost:8000/horizon`

Only available for:
- Local environment (any user)
- Production: users with `superadmin` role

## Development with Vite

For hot-reload during development:

```bash
# In one terminal - start Docker services
docker compose up -d

# In another terminal - run Vite dev server
npm run dev
```

Or run Vite inside Docker:

```bash
docker compose exec linkea.test npm run dev
```

## Environment Variables for Docker

Add these to your `.env` file:

```env
# Docker ports
APP_PORT=8000
VITE_PORT=5173
FORWARD_REDIS_PORT=6379

# User/Group IDs (run `id` command to get yours)
WWWUSER=1000
WWWGROUP=1000

# Redis connection
REDIS_CLIENT=predis
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379

# Use Redis for cache, queue, session
CACHE_STORE=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

# Horizon
HORIZON_NAME=Linkea
HORIZON_PREFIX=linkea_horizon_
```

## Stopping Services

```bash
# Stop all services
docker compose down

# Stop and remove volumes (clears Redis data)
docker compose down -v
```

## Troubleshooting

### Permission Issues

```bash
# Fix storage permissions
docker compose exec linkea.test chmod -R 775 storage bootstrap/cache
docker compose exec linkea.test chown -R sail:sail storage bootstrap/cache
```

### Horizon Not Processing Jobs

```bash
# Check Horizon status
docker compose exec linkea.test php artisan horizon:status

# Restart Horizon
docker compose restart horizon

# Clear failed jobs
docker compose exec linkea.test php artisan horizon:clear
```

### Redis Connection Issues

```bash
# Test Redis connection
docker compose exec redis redis-cli ping
# Should return: PONG

# Check Redis inside app
docker compose exec linkea.test php artisan tinker
>>> Redis::ping()
```

