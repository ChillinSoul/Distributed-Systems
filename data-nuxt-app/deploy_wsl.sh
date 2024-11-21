# deploy_wsl.sh
#!/bin/bash -e

# Variables
IMAGE_NAME="data-nuxt-app-image"

# Detect the operating system
OS="$(uname)"
IS_WINDOWS=false
if [[ "$OS" == *"NT"* || "$OS" == *"MINGW"* || "$OS" == *"CYGWIN"* ]]; then
  IS_WINDOWS=true
fi

echo "Enabling ingress in Minikube on $OS..."
minikube addons enable ingress

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

# Step 4: Clean up any existing resources
echo "Cleaning up existing resources..."
minikube kubectl -- delete statefulset mysql --ignore-not-found=true
minikube kubectl -- delete configmap mysql --ignore-not-found=true
minikube kubectl -- delete service mysql mysql-read --ignore-not-found=true
minikube kubectl -- delete deployment data-nuxt-app --ignore-not-found=true
minikube kubectl -- delete service data-nuxt-app-service --ignore-not-found=true
minikube kubectl -- delete ingress services-ingress --ignore-not-found=true
minikube kubectl -- delete secret mysql-secret --ignore-not-found=true
minikube kubectl -- delete pvc -l app=mysql --ignore-not-found=true

# Step 5: Build the Docker image
echo "Building the Docker image: $IMAGE_NAME..."
if docker build -t $IMAGE_NAME .; then
  echo "Docker image $IMAGE_NAME built successfully."
else
  echo "Docker image build failed. Exiting..."
  exit 1
fi


# Step 6: Deploy MySQL configurations
echo "Deploying MySQL to Kubernetes..."
minikube kubectl -- apply -f k8s/db/mysql-secret.yaml
minikube kubectl -- apply -f k8s/db/mysql-configmap.yaml
minikube kubectl -- apply -f k8s/db/mysql-services.yaml
minikube kubectl -- apply -f k8s/db/mysql-statefulset.yaml

# Wait for MySQL StatefulSet to be ready
echo "Waiting for MySQL StatefulSet to be ready..."
minikube kubectl -- rollout status statefulset/mysql --timeout=300s

# Initialize replication
echo "Initializing MySQL replication..."
minikube kubectl -- exec mysql-0 -- bash /mnt/config-map/init-primary.sh
for i in 1 2; do
  minikube kubectl -- exec mysql-$i -- bash /mnt/config-map/init-replica.sh
done

echo "Deployment process completed successfully."