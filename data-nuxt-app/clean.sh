#!/bin/bash

set -e

echo "Starting cleanup process for nuxt-app..."

# Step 1: Delete Kubernetes deployments and services
echo "Deleting Kubernetes deployments and services..."
kubectl delete -f ./deployment.yaml
kubectl delete -f ./service.yaml
kubectl delete -f ./ingress.yaml

echo "Cleanup process for nuxt-app completed successfully."