#!/bin/bash -e

# Unit test for the deployment script, if failed, exit

# ask for the user consent to run the tests

echo "Do you want to run the unit tests before deploying the application? (y/n)"
read -r run_tests

if [ "$run_tests" == "y" ]; then
  if ! npm run test; then
    echo "Unit tests failed. Exiting..."
    exit 1
  else
    echo "Unit tests passed."
  fi
fi


# Variables
IMAGE_NAME="data-nuxt-app-image"
NAMESPACE="default" # Update if using a different namespace

# Detect the operating system
OS="$(uname)"
IS_WINDOWS=false
if [[ "$OS" == *"NT"* || "$OS" == *"MINGW"* || "$OS" == *"CYGWIN"* ]]; then
  IS_WINDOWS=true
fi

echo "Starting deployment process..."

# Step 1: Build the Nuxt application
echo "Building the Nuxt application..."
if npm run build; then
  echo "Nuxt application built successfully."
else
  echo "Nuxt application build failed. Exiting..."
  exit 1
fi

# Step 2: Check if Minikube is running
echo "Checking if Minikube is running..."
if ! minikube status > /dev/null 2>&1; then
  echo "Minikube is not running. Please start it first using 'minikube start'."
  exit 1
fi

# Step 3: Point Docker to Minikube's Docker daemon
if [ "$IS_WINDOWS" = true ]; then
  echo "Detected Windows environment. Configuring Docker for Minikube on Windows..."
  winpty eval $(minikube docker-env)
else
  echo "Configuring Docker to use Minikube's Docker daemon..."
  eval $(minikube docker-env)
fi

# Step 4: Build the Docker image
# Step 4: Build the Docker image
IMAGE_TAG=$(date +%Y%m%d%H%M%S)
echo "Building the Docker image: $IMAGE_NAME:$IMAGE_TAG..."
docker rmi -f $IMAGE_NAME:latest || true
docker build -t $IMAGE_NAME:$IMAGE_TAG .
docker tag $IMAGE_NAME:$IMAGE_TAG $IMAGE_NAME:latest

# Step 5: Clean up any existing resources
echo "Cleaning up existing resources..."
minikube kubectl -- delete statefulset mysql-shard --ignore-not-found=true
minikube kubectl -- delete configmap mysql-config mysql-init --ignore-not-found=true
minikube kubectl -- delete service mysql-shard mysql-router --ignore-not-found=true
minikube kubectl -- delete secret mysql-secret --ignore-not-found=true
minikube kubectl -- delete pvc -l app=mysql-shard --ignore-not-found=true

# Step 6: Deploy MySQL Sharded Setup
echo "Deploying MySQL Sharded Setup..."
minikube kubectl -- apply -f k8s/sharded/secrets/mysql-secret.yaml
minikube kubectl -- apply -f k8s/sharded/configmaps/mysql-config.yaml
minikube kubectl -- apply -f k8s/sharded/configmaps/mysql-init.yaml
minikube kubectl -- apply -f k8s/sharded/services/mysql-shards.yaml
minikube kubectl -- apply -f k8s/sharded/services/mysql-router.yaml

echo "Deploying MySQL Shards..."
minikube kubectl -- apply -f k8s/sharded/statefulsets/mysql-shards.yaml

echo "Waiting for MySQL shards to be ready..."
minikube kubectl -- rollout status statefulset/mysql-shard --timeout=180s
minikube kubectl -- wait --for=condition=ready pod -l app=mysql-shard --timeout=120s


# Step 7: Deploy Application
echo "Deploying application to Kubernetes..."

if [[ "$OS" == "Darwin" ]]; then
  # macOS (BSD sed)
  sed -i '' "s|image: $IMAGE_NAME[^[:space:]]*|image: $IMAGE_NAME:$IMAGE_TAG|" deployment.yaml
else
  # Linux (GNU sed)
  sed -i "s|image: $IMAGE_NAME[^[:space:]]*|image: $IMAGE_NAME:$IMAGE_TAG|" deployment.yaml
fi
minikube kubectl -- apply -f deployment.yaml
minikube kubectl -- apply -f service.yaml
minikube kubectl -- apply -f ingress.yaml

# Step 8: Wait for Application to be Ready
echo "Waiting for application deployment to be ready..."
if minikube kubectl -- rollout status deployment/data-nuxt-app --timeout=120s; then
  echo "Deployment completed successfully."
else
  echo "Deployment failed. Rolling back..."
  minikube kubectl -- rollout undo deployment/data-nuxt-app
  exit 1
fi

echo "Deployment process finished successfully!"