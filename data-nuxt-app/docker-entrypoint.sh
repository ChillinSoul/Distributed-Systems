#!/bin/bash
set -e

# Wait for MySQL read service to be ready
max_retries=30
counter=0
echo "Waiting for MySQL to be ready..."
while ! mysql -h mysql-read -e "SELECT 1" >/dev/null 2>&1; do
    counter=$((counter + 1))
    if [ $counter -eq $max_retries ]; then
        echo "Failed to connect to MySQL after $max_retries attempts"
        exit 1
    fi
    echo "MySQL not ready yet. Retrying in 5 seconds..."
    sleep 5
done