#!/bin/bash
set -e

echo "Creating MySQL sharded deployment..."

# Create namespace if it doesn't exist
kubectl create namespace mysql-sharded 2>/dev/null || true

# Apply configurations
echo "Applying configurations..."
kubectl apply -f secrets/mysql-secret.yaml
kubectl apply -f configmaps/mysql-config.yaml
kubectl apply -f configmaps/mysql-init.yaml

# Apply services
echo "Creating services..."
kubectl apply -f services/mysql-shards.yaml
kubectl apply -f services/mysql-router.yaml

# Deploy shards
echo "Deploying MySQL shards..."
kubectl apply -f statefulsets/mysql-shards.yaml

# Wait for shards to be ready
echo "Waiting for MySQL shards to be ready..."
kubectl rollout status statefulset/mysql-shard --timeout=300s

echo "MySQL sharded deployment completed successfully!"