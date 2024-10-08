#!/bin/bash -e

echo "Starting cleanup process for nuxt-app..."

# Step 1: Delete Kubernetes deployments and services
echo "Deleting Kubernetes deployments and services..."
minikube kubectl -- delete -f ./deployment.yaml
minikube kubectl -- delete -f ./service.yaml
minikube kubectl -- delete -f ./ingress.yaml

echo "Cleanup process for nuxt-app completed successfully."