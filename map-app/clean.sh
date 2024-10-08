#!/bin/bash

set -e

echo "Starting cleanup process for hello-k8s..."

# Step 1: Delete Kubernetes deployments and services
echo "Deleting Kubernetes deployments and services..."
kubectl delete -f ./deployment.yaml
kubectl delete -f ./service.yaml

echo "Cleanup process for hello-k8s completed successfully."