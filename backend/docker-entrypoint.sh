#!/bin/bash
set -e

# Wait for MySQL to be ready
echo "Waiting for database connection on db:3306..."
while ! timeout 1 bash -c 'cat < /dev/null > /dev/tcp/db/3306' 2>/dev/null; do
  echo "Database is not ready yet, sleeping..."
  sleep 2
done

echo "Database is up!"

# Initialize .env from example if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

# Ensure APP_KEY is set
if [ -f .env ] && ! grep -q "APP_KEY=base64" .env; then
    echo "Generating application key..."
    php artisan key:generate
fi

# Run migrations and seed data
# Note: --force is required to run in production mode
echo "Running database migrations..."
php artisan migrate --force

# Check if we should seed (optional: only seed if no users exist)
# For development convenience, we'll just run it. 
# In a real production app, you'd handle this more carefully.
echo "Seeding database..."
php artisan db:seed --force

# Start the application
echo "Starting Laravel server..."
exec "$@"
