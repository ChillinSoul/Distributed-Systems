#!/bin/bash

# Exit script on any error
set -e

# Variables
IMAGE_NAME="hello-k8s"

# Detect the operating system
OS="$(uname)"
IS_WINDOWS=false

if [[ "$OS" == *"NT"* || "$OS" == *"MINGW"* || "$OS" == *"CYGWIN"* ]]; then
  IS_WINDOWS=true
fi

echo "Starting deployment process for $IMAGE_NAME on $OS..."


# Step 2: Check if Minikube is running
echo "Checking if Minikube is running..."
if ! minikube status > /dev/null 2>&1; then
  echo "Minikube is not running. Please start it first using 'minikube start'."
  exit 1
fi

# Step 3: Point Docker to Minikube's Docker daemon
if [ "$IS_WINDOWS" = true ]; then
  echo "Detected Windows environment. Configuring Docker for Minikube on Windows..."
  
  # For Windows (Git Bash/Cygwin), use winpty to set Minikube Docker environment
  winpty eval $(minikube docker-env)

  # If you're using Docker Desktop, it might already be configured properly, and you may skip this part.
else
  echo "Configuring Docker to use Minikube's Docker daemon..."
  eval $(minikube docker-env)
fi

# Step 4: Build the Docker image for nginx-home
echo "Building the Docker image: $IMAGE_NAME..."
if docker build -t $IMAGE_NAME .; then
  echo "Docker image $IMAGE_NAME built successfully."
else
  echo "Docker image build failed. Exiting..."
  exit 1
fi

# Step 5: Apply Kubernetes configurations
echo "Deploying to Kubernetes..."
if kubectl apply -f ./deployment.yaml && kubectl apply -f ./service.yaml; then
  echo "Deployment to Kubernetes completed successfully."
else
  echo "Kubernetes deployment failed. Exiting..."
  exit 1
fi

echo "Deployment process for $IMAGE_NAME completed successfully."