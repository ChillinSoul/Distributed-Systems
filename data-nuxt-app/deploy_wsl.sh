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
minikube kubectl -- delete statefulset mysql-shard --ignore-not-found=true
minikube kubectl -- delete configmap mysql-config mysql-init --ignore-not-found=true
minikube kubectl -- delete service mysql-shard mysql-router --ignore-not-found=true
minikube kubectl -- delete deployment data-nuxt-app --ignore-not-found=true
minikube kubectl -- delete service data-nuxt-app-service --ignore-not-found=true
minikube kubectl -- delete ingress services-ingress --ignore-not-found=true
minikube kubectl -- delete secret mysql-secret --ignore-not-found=true
minikube kubectl -- delete pvc -l app=mysql-shard --ignore-not-found=true

# Step 5: Build the Docker image
echo "Building the Docker image: $IMAGE_NAME..."
if docker build -t $IMAGE_NAME .; then
  echo "Docker image $IMAGE_NAME built successfully."
else
  echo "Docker image build failed. Exiting..."
  exit 1
fi

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

# Step 7: Initialize shards
echo "Initializing shards..."
for i in {0..1}; do
  echo "Initializing shard $i..."
  minikube kubectl -- exec -i mysql-shard-$i -- mysql \
    -h mysql-shard-$i.mysql-shard \
    -u manneken \
    -p"$(minikube kubectl -- get secret mysql-secret -o jsonpath="{.data.MYSQL_PASSWORD}" | base64 --decode)" \
    mannekendata < k8s/sharded/configmaps/mysql-init.yaml
done

# Step 8: Deploy application
echo "Deploying application to Kubernetes..."
minikube kubectl -- apply -f deployment.yaml
minikube kubectl -- apply -f service.yaml
minikube kubectl -- apply -f ingress.yaml

echo "Waiting for application deployment to be ready..."
minikube kubectl -- rollout status deployment/data-nuxt-app --timeout=120s

echo "Deployment process completed successfully."