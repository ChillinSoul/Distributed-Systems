#!/bin/bash
set -e

# Wait for MySQL read service to be ready
max_retries=30
counter=0
echo "Waiting for MySQL to be ready..."
while ! mysql -h mysql-read -u$MYSQL_USER -p$MYSQL_PASSWORD -e "SELECT 1" >/dev/null 2>&1; do
    counter=$((counter + 1))
    if [ $counter -eq $max_retries ]; then
        echo "Failed to connect to MySQL after $max_retries attempts"
        exit 1
    fi
    echo "MySQL not ready yet. Retrying in 5 seconds..."
    sleep 5
done

echo "MySQL is ready, waiting additional 10 seconds for replication setup..."
sleep 10

echo "Pushing the database schema..."
npx prisma db push --accept-data-loss

echo "Starting application..."
exec "$@"