#!/bin/bash -e

echo "Starting cleanup process for map-app..."

# Step 1: Delete Kubernetes deployments and services
echo "Deleting Kubernetes deployments and services..."
minikube kubectl -- delete -f ./deployment.yaml
minikube kubectl -- delete -f ./service.yaml

echo "Cleanup process for map-app completed successfully."