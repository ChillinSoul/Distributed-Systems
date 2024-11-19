#!/bin/bash

set -e

echo "Starting cleanup process for data-nuxt-app..."

# Step 1: Delete Kubernetes deployments and services
echo "Deleting Kubernetes deployments and services..."
kubectl delete -f ./deployment.yaml
kubectl delete -f ./service.yaml
kubectl delete -f ./ingress.yaml

minikube kubectl -- delete -f k8s/db/mysql-secret.yaml
minikube kubectl -- delete -f k8s/db/mysql-pv.yaml
minikube kubectl -- delete -f k8s/db/mysql-pvc.yaml
minikube kubectl -- delete -f k8s/db/mysql-deployment.yaml
minikube kubectl -- delete -f k8s/db/mysql-service.yaml

echo "Cleanup process for data-nuxt-app completed successfully."