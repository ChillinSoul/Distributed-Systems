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

#deploy crds and operator
echo "Deploying to Kubernetes..."
if minikube kubectl -- apply -f ./crds.yaml && minikube kubectl -- apply -f ./operator.yaml; then
  echo "Deployment crds and operator to Kubernetes completed successfully."
else
  echo "Kubernetes deployment failed. Exiting..."
  exit 1
fi

#build docker image
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

#deploy crds and operator
echo "Deploying to Kubernetes..."
if minikube kubectl -- apply -f ./client-insecure-operator.yaml && minikube kubectl -- apply -f ./example.yaml; then
  echo "Deployment crds and operator to Kubernetes completed successfully."
else
  echo "Kubernetes deployment failed. Exiting..."
  exit 1
fi

# Wait for the CockroachDB pod to be ready
echo "Waiting for CockroachDB to be ready..."
sleep 60

echo "Creating database and tables in CockroachDB..."
kubectl exec -it cockroachdb-client-insecure -- ./cockroach sql --insecure --host=cockroachdb-public <<EOF
CREATE DATABASE cameradata;
USE cameradata;
CREATE TABLE camera (
    id INT PRIMARY KEY DEFAULT unique_rowid(),
    available VARCHAR(255),
    cameraname VARCHAR(255),
    cameranumber VARCHAR(255),
    position INTEGER[]
);
INSERT INTO camera (available, cameraname, cameranumber, position) 
VALUES ('true', 'CAM1', 'C001', ARRAY[10, 30]),
       ('true', 'CAM2', 'C002', ARRAY[1, 3]),
       ('true', 'CAM3', 'C003', ARRAY[2, 5]);
CREATE TABLE video (
    id INT PRIMARY KEY DEFAULT unique_rowid(),
    cameranumber VARCHAR(255),
    numberplate VARCHAR(255),
    typevehicule VARCHAR(255),
    createat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO video (cameranumber, numberplate, typevehicule)
VALUES ('C001', '1-LOL-666', 'voiture');
EOF

if [ $? -eq 0 ]; then
  echo "Database and tables created successfully."
else
  echo "Failed to create database and tables. Exiting..."
  exit 1
fi

echo "Deployment process for camera-app completed successfully."