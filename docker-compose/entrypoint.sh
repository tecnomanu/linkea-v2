#!/bin/bash
set -e

echo "Starting Linkea v2 container..."

# Wait for MySQL to be ready
echo "Waiting for MySQL..."
while ! mysqladmin ping -h"$DB_HOST" --silent; do
    sleep 1
done
echo "MySQL is ready!"

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
