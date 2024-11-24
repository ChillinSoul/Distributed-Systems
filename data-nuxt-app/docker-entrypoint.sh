#!/bin/bash
set -e

# Wait for MySQL shards to be ready
max_retries=30
counter=0
echo "Waiting for MySQL shards to be ready..."

# Check both shards
for shard in {0..1}; do
    counter=0
    while ! mysql -h mysql-shard-$shard.mysql-shard \
                 -u root \
                 -p"$MYSQL_ROOT_PASSWORD" \
                 -e "SELECT 1" >/dev/null 2>&1; do
        counter=$((counter + 1))
        if [ $counter -eq $max_retries ]; then
            echo "Failed to connect to MySQL shard $shard after $max_retries attempts"
            exit 1
        fi
        echo "MySQL shard $shard not ready yet. Retrying in 5 seconds..."
        sleep 5
    done
    echo "MySQL shard $shard is ready!"
done

echo "All MySQL shards are ready!"
exec "$@"