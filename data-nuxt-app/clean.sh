#!/bin/bash

set -e

echo "Starting cleanup process for data-nuxt-app..."

# Step 1: Delete Kubernetes deployments and services
echo "Deleting Kubernetes deployments and services..."
kubectl delete -f ./deployment.yaml
kubectl delete -f ./service.yaml
kubectl delete -f ./ingress.yaml
kubectl delete -f ./mysql-deployment.yaml
kubectl delete -f ./mysql-service.yaml
kubectl delete -f ./mysql-pv.yaml

echo "Cleanup process for data-nuxt-app completed successfully."