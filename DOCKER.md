# Linkea v2 - Docker Configuration

Este proyecto tiene dos configuraciones de Docker:

| Archivo | Uso | Descripción |
|---------|-----|-------------|
| `docker-compose.yml` | **Desarrollo** | Laravel Sail con hot-reload, Mailpit |
| `docker-compose.prod.yml` | **Producción/Staging** | Imagen optimizada con supervisord |
| `docker-compose.dokploy.yml` | **Dokploy** | Para deploy en Dokploy |

---

## Desarrollo Local (Sail)

Laravel Sail provee un entorno de desarrollo completo con hot-reload y todas las herramientas necesarias.

### Requisitos
- Docker Desktop
- Composer (para instalar Sail inicialmente)

### Iniciar el entorno

```bash
# Primera vez: instalar dependencias
composer install

# Iniciar Sail
./vendor/bin/sail up -d

# O con alias (agregar a ~/.zshrc o ~/.bashrc):
# alias sail='[ -f sail ] && sh sail || sh vendor/bin/sail'
sail up -d

# Ejecutar migraciones
sail artisan migrate

# Seed de datos (opcional)
sail artisan db:seed
```

### Servicios incluidos

| Servicio | Puerto Local | Descripción |
|----------|--------------|-------------|
| Laravel App | `80` | Aplicacion principal |
| Vite Dev Server | `5173` | Hot Module Replacement |
| MySQL | `3306` | Base de datos |
| Redis | `6379` | Cache y colas |
| Mailpit | `8025` | Testing de emails (UI) |
| Mailpit SMTP | `1025` | SMTP para emails |
| Horizon | - | Worker de colas (integrado) |
| Scheduler | - | Cron jobs (integrado) |

### Variables de entorno para Sail

```env
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=linkea
DB_USERNAME=sail
DB_PASSWORD=password

REDIS_HOST=redis
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
```

### Comandos utiles

```bash
# Ver logs
sail logs -f

# Solo logs de horizon
sail logs -f horizon

# Acceder a MySQL
sail mysql

# Acceder a Redis
sail redis

# Ejecutar artisan
sail artisan <command>

# Ejecutar npm
sail npm run dev

# Detener
sail down
```

---

## Produccion/Staging (Custom Dockerfile)

Para produccion se usa una imagen optimizada con nginx, php-fpm, horizon y cron, todos manejados por supervisord.

### Iniciar el entorno

```bash
# Copiar y configurar .env
cp .env.docker .env
# Editar .env con las credenciales correctas

# Construir e iniciar
docker compose -f docker-compose.prod.yml up -d --build

# Ejecutar migraciones
docker compose -f docker-compose.prod.yml exec app php artisan migrate --force

# Seed (solo primera vez o con datos de prueba)
docker compose -f docker-compose.prod.yml exec app php artisan db:seed --force
```

### Servicios incluidos

| Servicio | Puerto Local | Descripcion |
|----------|--------------|-------------|
| App (nginx + php-fpm + horizon + cron) | `8080` | Todo en uno |
| MySQL | `3307` | Base de datos |
| Redis | `6380` | Cache y colas |

### Variables de entorno para Produccion

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://linkea.ar

DB_CONNECTION=mysql
DB_HOST=linkea-mysql
DB_PORT=3306
DB_DATABASE=linkea
DB_USERNAME=linkea
DB_PASSWORD=<strong-password>

REDIS_HOST=linkea-redis
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=<your-smtp-host>
MAIL_PORT=587
MAIL_USERNAME=<your-smtp-user>
MAIL_PASSWORD=<your-smtp-password>
```

### Comandos utiles

```bash
# Ver logs de la app
docker compose -f docker-compose.prod.yml logs -f app

# Ejecutar artisan
docker compose -f docker-compose.prod.yml exec app php artisan <command>

# Reiniciar Horizon
docker compose -f docker-compose.prod.yml exec app php artisan horizon:terminate

# Ver estado de Horizon
docker compose -f docker-compose.prod.yml exec app php artisan horizon:status

# Detener
docker compose -f docker-compose.prod.yml down
```

---

## Dokploy

Para deploy en Dokploy, usar `docker-compose.dokploy.yml`. Este archivo esta preparado para conectarse a la red de Dokploy.

```bash
# Dokploy se encarga del deploy automaticamente
# Solo asegurate de configurar las variables de entorno en el panel de Dokploy
```

---

## Arquitectura

### Desarrollo (Sail)
```
┌─────────────────────────────────────────────────────────┐
│                    Docker Network (sail)                 │
│  ┌──────────────┐  ┌────────┐  ┌───────┐  ┌──────────┐ │
│  │ laravel.test │  │ mysql  │  │ redis │  │ mailpit  │ │
│  │  (php-fpm)   │  │        │  │       │  │          │ │
│  │  Port: 80    │  │ :3306  │  │ :6379 │  │ :8025    │ │
│  └──────────────┘  └────────┘  └───────┘  └──────────┘ │
│  ┌──────────────┐                                       │
│  │   horizon    │  <- Horizon + Scheduler               │
│  │ (queue/cron) │                                       │
│  └──────────────┘                                       │
└─────────────────────────────────────────────────────────┘
```

### Produccion (Custom)
```
┌─────────────────────────────────────────────────────────┐
│              Docker Network (linkea-network)             │
│  ┌────────────────────────────────┐  ┌────────┐        │
│  │            app                 │  │ mysql  │        │
│  │  ┌─────────┐  ┌──────────┐    │  │        │        │
│  │  │  nginx  │  │ php-fpm  │    │  │ :3306  │        │
│  │  │  :80    │  │          │    │  └────────┘        │
│  │  └─────────┘  └──────────┘    │  ┌───────┐         │
│  │  ┌─────────┐  ┌──────────┐    │  │ redis │         │
│  │  │ horizon │  │   cron   │    │  │       │         │
│  │  │ (queue) │  │(schedule)│    │  │ :6379 │         │
│  │  └─────────┘  └──────────┘    │  └───────┘         │
│  │       supervisord             │                     │
│  └────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────┘
```

---

## Troubleshooting

### El archivo `public/hot` causa problemas en produccion
Este archivo es creado por Vite en desarrollo. Si aparece en produccion, eliminalo:
```bash
docker compose -f docker-compose.prod.yml exec app rm -f /var/www/public/hot
```

### Horizon no procesa jobs
```bash
# Verificar estado
docker compose -f docker-compose.prod.yml exec app php artisan horizon:status

# Reiniciar
docker compose -f docker-compose.prod.yml exec app php artisan horizon:terminate

# Ver logs
docker compose -f docker-compose.prod.yml logs -f app | grep horizon
```

### Permisos de storage
```bash
docker compose -f docker-compose.prod.yml exec app chown -R www-data:www-data /var/www/storage
docker compose -f docker-compose.prod.yml exec app chmod -R 775 /var/www/storage
```
