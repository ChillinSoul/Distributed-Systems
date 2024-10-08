# MannekenData

**MannekenData** is a Nuxt-based platform engineered for Kubernetes, designed to provide real-time traffic analysis in Brussels. The platform aims to enhance urban mobility by leveraging scalable data processing solutions.

This guide will help you deploy the `nuxt-app` (located under `/nuxt-app`) and optionally additional services from GitHub. You'll also set up an Ingress controller with a load balancer to link everything to `localhost`, accessing the services via `<Ingress IP>:<port>/nuxt-app`, `<Ingress IP>:<port>/service-a`, etc.

---

## Prerequisites

- **Kubernetes Cluster**: Running locally (e.g., Minikube) or on the cloud.
- **Docker**: Installed and configured.
- **kubectl**: Kubernetes command-line tool installed.
- **Minikube**: For local Kubernetes cluster (if applicable).
- **Ingress Controller**: NGINX Ingress Controller enabled in Minikube.
- **Available Ports**: Ensure port `3000` and the Ingress controller's port are available.
- **Git**: Installed for cloning repositories.
- **Optional**: Additional services to deploy from GitHub.

---

## Getting Started

### 0. Easy start mac os 

If you do this, IGNORE the rest

```bash
chmod +x deploy.sh clean.sh /nuxt-app/deploy.sh /nuxt-app/clean.sh /nginx-home/deploy.sh /nginx-home/clean.sh 
```

to start

```bash
./deploy.sh
```

to acces the app through localhost
```bash 
minikube tunnel
```

to cleanup

```bash
./clean.sh
```

### 0.1 Easy start using WSL

If you do this, IGNORE the rest

Run Power Shell as Administrator and run the following commands in PowerShell:

```PowerShell
wsl
```

head to nuxt-app directory:

```bash
cd nuxt-app
```

```bash
chmod +x deploy_wsl.sh clean_wsl.sh
```

install dos2unix and run it on the bash scripts:

```bash
sudo apt-get install dos2unix
dos2unix ./deploy_wsl.sh ./cleanup_wsl.sh
```

Create the alias for kubectl:

```bash
alias kubectl="minikube kubectl --"
```

to start

```bash
bash ./deploy_wsl.sh
```

to acces the app through localhost
```bash 
minikube tunnel
```

to cleanup

```bash
bash ./clean_wsl.sh
```

### 1. Start Minikube and Enable Ingress Addon

If you're using Minikube, start it with the necessary resources and enable the Ingress addon.

```bash
# Start Minikube with enough resources
minikube start --memory=4096 --cpus=2

# Enable the Ingress addon
minikube addons enable ingress
```

---

### 2. Build the Docker Image for Nuxt App

Navigate into the `nuxt-app` directory:

```bash
cd nuxt-app
```

Build the app

```bash
npm run build
```

Ensure Kubernetes is up and running. Then, build the Docker image for the Nuxt app:

```bash
# Build the Docker image inside Minikube's Docker environment
eval $(minikube docker-env)
docker build -t nuxt-app-image .
```

> **Note:** By running `eval $(minikube docker-env)`, you're pointing your Docker CLI to use Minikube's Docker daemon. This avoids the need to push the image to a container registry.

---

### 3. (Optional) Clone and Build Additional Services

If you have additional services on GitHub that you want to deploy, follow these steps:

#### Clone the Repositories

```bash
# Replace 'yourusername' and 'service-name' with your GitHub username and repository name

# Example for Service A
git clone https://github.com/yourusername/service-a.git
cd service-a

# Build the Docker image for Service A inside Minikube's Docker environment
docker build -t service-a-image .

# Navigate back to the root directory
cd ../

# Repeat for additional services
# Example for Service B
git clone https://github.com/yourusername/service-b.git
cd service-b
docker build -t service-b-image .
cd ../
```

---

### 4. Deploy Applications to Kubernetes

#### Deploy Nuxt App

Apply the Kubernetes configuration for the Nuxt app:

```bash
kubectl apply -f ./deployment.yaml
kubectl apply -f ./service.yaml
```

#### Deploy Additional Services

For each additional service, apply their Kubernetes configurations:

```bash
# Deploy Service A
kubectl apply -f ./service-a/deployment.yaml
kubectl apply -f ./service-a/service.yaml

# Deploy Service B
kubectl apply -f ./service-b/deployment.yaml
kubectl apply -f ./service-b/service.yaml
```

---

### 5. Configure Ingress Resource

Create an Ingress resource to route traffic to your services based on URL paths.

#### Create the Ingress Configuration (`ingress.yaml`)

In your project root directory, create a file named `ingress.yaml` with the following content:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: services-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$2
spec:
  ingressClassName: nginx
  rules:
    - http:
        paths:
          - path: /nuxt-app
            pathType: Prefix
            backend:
              service:
                name: nuxt-app-service
                port:
                  number: 80
          - path: /service-a
            pathType: Prefix
            backend:
              service:
                name: service-a-service
                port:
                  number: 80
          # Add more services as needed
```

> **Note:** The annotation `nginx.ingress.kubernetes.io/rewrite-target: /$1` ensures that the path is correctly rewritten when forwarding requests to the backend services.

#### Apply the Ingress Configuration

```bash
kubectl apply -f ./ingress.yaml
```

---

### 6. Verify Deployment

Check if the deployments are successful by listing the pods:

```bash
kubectl get pods
```

Ensure all your services are running and the pods are in the `Running` state.

---

### 7. Access the Services

To access the services, you need to obtain the IP address of the Ingress controller.

#### Get the Ingress IP

Since we're using Minikube, you can use the following command to get the Ingress controller's IP:

```bash
minikube ip
```

#### Run `minikube tunnel` (Important Step)

To expose the Ingress controller on your local network interface, run:

```bash
minikube tunnel
```

This command needs to run in a separate terminal window and may require administrative privileges.

> **Note:** `minikube tunnel` creates a network route to make LoadBalancer and Ingress resources accessible on `localhost` or the Minikube IP.

#### Access the Services in Your Web Browser

- **Nuxt App**: `http://localhost/nuxt-app` or `http://<Minikube IP>/nuxt-app`
- **Service A**: `http://localhost/service-a` or `http://<Minikube IP>/service-a`
- **Service B**: `http://localhost/service-b` or `http://<Minikube IP>/service-b`

**Example:**

If the Minikube IP is `192.168.49.2`:

- Nuxt App: [http://192.168.49.2/nuxt-app](http://192.168.49.2/nuxt-app)
- Or via localhost: [http://localhost/nuxt-app](http://localhost/nuxt-app)

---

### 8. Troubleshooting

If you're still unable to access the services, consider the following steps:

#### Check Ingress Controller Pods

Ensure the Ingress controller pods are running:

```bash
kubectl get pods -n ingress-nginx
```

#### Check Ingress Resource

Describe the Ingress to check for any errors:

```bash
kubectl describe ingress services-ingress
```

#### Verify Service Endpoints

Ensure the services have endpoints:

```bash
kubectl get endpoints
```

#### Port Forwarding (Alternative Method)

If `minikube tunnel` is not an option, you can port-forward the Ingress controller service:

```bash
kubectl port-forward --namespace ingress-nginx service/ingress-nginx-controller 8080:80
```

Then access your services via:

- **Nuxt App**: [http://localhost:8080/nuxt-app](http://localhost:8080/nuxt-app)

---

### 9. Clean Up

To remove the deployed applications and resources, run the following commands:

#### Delete Nuxt App Resources

```bash
kubectl delete -f ./deployment.yaml
kubectl delete -f ./service.yaml
```

#### Delete Additional Services Resources

```bash
# Delete Service A
kubectl delete -f ./service-a/deployment.yaml
kubectl delete -f ./service-a/service.yaml

# Delete Service B
kubectl delete -f ./service-b/deployment.yaml
kubectl delete -f ./service-b/service.yaml
```

#### Delete Ingress Resource

```bash
kubectl delete -f ./ingress.yaml
```
