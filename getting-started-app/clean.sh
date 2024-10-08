#!/bin/bash

set -e

echo "Starting cleanup process for bb-app..."

# Step 1: Delete Kubernetes deployments and services
echo "Deleting Kubernetes deployments and services..."
kubectl delete -f ./deployment.yaml
kubectl delete -f ./service.yaml

echo "Cleanup process for bb-app completed successfully."