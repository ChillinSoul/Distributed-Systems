#!/bin/bash -e

# Variables
IMAGE_NAME="camera-app-image"

# Detect the operating system
OS="$(uname)"
IS_WINDOWS=false

if [[ "$OS" == *"NT"* || "$OS" == *"MINGW"* || "$OS" == *"CYGWIN"* ]]; then
  IS_WINDOWS=true
fi

echo "Starting deployment process for camera-app..."

echo "Checking if Minikube is running..."
if ! minikube status > /dev/null 2>&1; then
  echo "Minikube is not running. Please start it first using 'minikube start'."
  exit 1
fi
npm i;
echo "Configuring Docker to use Minikube's Docker daemon..."
eval $(minikube docker-env)


echo "Building the Docker image: $IMAGE_NAME..."
if docker build -t $IMAGE_NAME .; then
  echo "Docker image $IMAGE_NAME built successfully."
else
  echo "Docker image build failed. Exiting..."
  exit 1
fi

echo "Deploying to Kubernetes..."
if minikube kubectl -- apply -f ./deployment.yaml && minikube kubectl -- apply -f ./service.yaml; then
  echo "Deployment to Kubernetes completed successfully."
else
  echo "Kubernetes deployment failed. Exiting..."
  exit 1
fi

echo "Deployment process for camera-app completed successfully."