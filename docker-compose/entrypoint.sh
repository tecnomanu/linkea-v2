#!/bin/bash
set -e

echo "Starting Linkea v2 container..."

# Wait for MySQL to be ready (only if mysqladmin exists)
if command -v mysqladmin > /dev/null 2>&1; then
    echo "Waiting for MySQL..."
    while ! mysqladmin ping -h"${DB_HOST:-mysql}" --silent; do
        sleep 1
    done
    echo "MySQL is ready!"
else
    echo "mysqladmin not found, skipping MySQL wait. If you need DB readiness-check, install mysql-client."
fi

# Run migrations if needed
if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "Running migrations..."
    php /var/www/artisan migrate --force
fi

# Clear and cache config
php /var/www/artisan config:cache
php /var/www/artisan route:cache
php /var/www/artisan view:cache

# Set proper permissions
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

echo "Starting supervisord..."
exec supervisord -c /etc/supervisor.d/supervisord.ini
