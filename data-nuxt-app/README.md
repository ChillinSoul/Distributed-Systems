# MannekenData

**MannekenData** is a Nuxt-based platform engineered for Kubernetes, designed to provide real-time traffic analysis in Brussels. The platform aims to enhance urban mobility by leveraging scalable data processing solutions.

This guide will help you deploy the `data-nuxt-app` and optionally additional services from GitHub. You'll also set up an Ingress controller with a load balancer to link everything to `localhost`, accessing the services via `<Ingress IP>:<port>/data-nuxt-app`, `<Ingress IP>:<port>/service-a`, etc.

## Prerequisites

- **Kubernetes Cluster**: Running locally (e.g., Minikube) or on the cloud.
- **Docker**: Installed and configured.
- **kubectl**: Kubernetes command-line tool installed.
- **Minikube**: For local Kubernetes cluster (if applicable).
- **Ingress Controller**: NGINX Ingress Controller enabled in Minikube.
- **Available Ports**: Ensure port `3000` and the Ingress controller's port are available.
- **Git**: Installed for cloning repositories.
- **Node.js**: Version 22.9.0 or later for application development.
- **Optional**: Additional services to deploy from GitHub.

## Getting Started

### Starting Minikube with Optimal Configuration

Before deploying the application, we need to start Minikube with specific parameters that ensure optimal performance for our traffic analysis platform. Here's the recommended configuration:

```bash
minikube start --cpus=8 --memory=5000 --addons=metrics-server --extra-config=kubelet.housekeeping-interval=10s --force
```

Let's understand what each parameter does:

- `--cpus=8`: Allocates 8 CPU cores to the Minikube cluster. This higher CPU allocation is necessary for running our sharded database architecture and handling real-time traffic data processing efficiently.

- `--memory=5000`: Assigns 5GB of memory to the cluster. This generous memory allocation ensures smooth operation of our MySQL shards, the Nuxt application, and monitoring tools without resource constraints.

- `--addons=metrics-server`: Automatically enables the metrics server addon during startup. The metrics server is crucial for our monitoring setup as it collects resource utilization data used by the Horizontal Pod Autoscaler (HPA).

- `--extra-config=kubelet.housekeeping-interval=10s`: Configures the kubelet to perform housekeeping operations every 10 seconds instead of the default interval. This more frequent checking helps our HPA respond more quickly to load changes.

- `--force`: Forces a new cluster creation, ensuring a clean start without any residual configurations from previous deployments.

After running this command, verify that Minikube is running correctly:

```bash
minikube status
```

You should see output indicating that the cluster is running, and all components are properly configured:

```
minikube
type: Control Plane
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```

### Easy Start with Deployment Script

If you choose this method, you can ignore the manual deployment steps that follow.

1. If you are on windows, Run PowerShell as Administrator and start WSL:

```PowerShell
wsl
```

2. Navigate to the project directory:

```bash
cd data-nuxt-app
chmod +x deploy_wsl.sh
```

3. Install and run dos2unix:

```bash
sudo apt-get install dos2unix
dos2unix ./deploy_wsl.sh
```

4. Create kubectl alias:

```bash
alias kubectl="minikube kubectl --"
```

5. Deploy and run:

```bash
bash ./deploy_wsl.sh
minikube tunnel
```

The WSL deployment will also set up monitoring tools and HPA automatically.

## Architecture Overview

MannekenData uses a sharded MySQL database architecture for horizontal scaling:

- Each shard handles a specific range of data based on shard keys
- Direct MySQL connections are used for optimal performance
- Automatic shard routing based on data distribution
- Built-in support for multi-shard queries

The application is structured into several key components:

- **Frontend**: Built with Nuxt.js 3 and Tailwind CSS
- **Backend**: Node.js with direct MySQL connections
- **Database**: Sharded MySQL deployment on Kubernetes
- **Services**: Modular service architecture for ANPR and traffic data processing

## Monitoring and Management

MannekenData includes comprehensive monitoring capabilities through multiple tools to ensure optimal performance and scaling.

To launch the monitoring tools, run the following commands:

```bash
cd k8s/monitoring
./setup-monitoring.sh
```

### Horizontal Pod Autoscaling (HPA)

The application uses Kubernetes HPA to automatically scale based on resource utilization:

- Minimum replicas: 2
- Maximum replicas: 5
- Target CPU utilization: 50%
- Scale-up stabilization window: 30 seconds
- Scale-down stabilization window: 300 seconds

You can monitor the HPA status:

```bash
kubectl get hpa data-nuxt-app-hpa
# To watch HPA decisions in real-time
kubectl get hpa data-nuxt-app-hpa -w
```

### K9s Terminal UI

K9s provides a terminal-based UI for monitoring and managing Kubernetes clusters:

1. Access the K9s dashboard:

```bash
k9s
```

2. Common K9s commands:

- Press '0' to see all resources
- Type 'hpa' and Enter to view autoscalers
- Type 'pod' and Enter to see pods
- Press '?' for help menu
- Use ':namespace' to switch namespaces
- Press 'ctrl+d' to delete resources

### Metrics Server

The metrics server provides resource utilization data:

```bash
# Enable metrics server
minikube addons enable metrics-server

# View node metrics
kubectl top nodes

# View pod metrics
kubectl top pods
```

### Load Testing

To test the HPA scaling capabilities:

```bash
kubectl run -i --tty load-generator --rm --image=busybox --restart=Never -- /bin/sh -c "while sleep 0.01; do wget -q -O- http://data-nuxt-app-service/data-nuxt-app/data-view; done"
```

### Managing Database Shards

You can view shard status and distribution:

```bash
# Check shard status
kubectl get statefulset mysql-shard

# View shard logs
kubectl logs -l app=mysql-shard
```

## Accessing the Application

After deployment, access the following endpoints:

- Main Application: `http://localhost/data-nuxt-app`
- Traffic Data View: `http://localhost/data-nuxt-app/traffic-data`
- Formula Interface: `http://localhost/data-nuxt-app/formulas`
- API Documentation: `http://localhost/data-nuxt-app/api-docs`

## Troubleshooting

### Common Issues and Solutions

1. If pods are not starting, check their status:

```bash
kubectl get pods
kubectl describe pod <pod-name>
```

2. For database connectivity issues:

```bash
# Check shard status
kubectl get statefulset mysql-shard
# View database logs
kubectl logs -l app=mysql-shard
```

3. If services are not accessible:

```bash
# Check ingress status
kubectl get ingress
kubectl describe ingress services-ingress
```

4. For networking issues:

```bash
# Verify service endpoints
kubectl get endpoints
# Check ingress controller
kubectl get pods -n ingress-nginx
```

5. If metrics are not appearing:

```bash
kubectl -n kube-system rollout restart deployment metrics-server
```

## API Specifications

The API specifications for the MannekenData platform are available in the `public/api-docs` directory as the openapi.yaml file.

## Contributors

- Axel Bergiers
- Basil Mannaerts

## License

MIT License - See LICENSE file for details
