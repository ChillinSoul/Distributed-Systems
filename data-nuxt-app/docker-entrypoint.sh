#!/bin/bash
set -e

# Wait for MySQL to be ready
max_retries=30
counter=0
echo "Waiting for MySQL to be ready..."
while ! nc -z mysql 3306; do
    counter=$((counter + 1))
    if [ $counter -eq $max_retries ]; then
        echo "Failed to connect to MySQL after $max_retries attempts"
        exit 1
    fi
    echo "MySQL not ready yet. Retrying in 5 seconds..."
    sleep 5
done

echo "MySQL is ready, waiting additional 10 seconds for full initialization..."
sleep 10

echo "Pushing the database schema..."
npx prisma db push --accept-data-loss

echo "Starting application..."
exec "$@"