#!/bin/bash
# k8s/monitoring/setup-monitoring.sh

# Exit on error
set -e

echo "Setting up monitoring and scaling infrastructure..."

# Add Helm repositories
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# Install Prometheus Stack (includes Grafana)
echo "Installing Prometheus and Grafana..."
helm install monitoring prometheus-community/kube-prometheus-stack -f prometheus-values.yaml

# Apply HPA configuration
echo "Applying HPA configuration..."
minikube kubectl -- apply -f hpa.yaml

# Apply ServiceMonitor
echo "Applying ServiceMonitor..."
minikube kubectl -- apply -f service-monitor.yaml

# Wait for pods to be ready
echo "Waiting for monitoring components to be ready..."
minikube kubectl -- wait --for=condition=ready pod -l app=prometheus --timeout=300s
minikube kubectl -- wait --for=condition=ready pod -l app=grafana --timeout=300s

echo "Setting up port forwarding for Grafana..."
# Forward Grafana port (run in background)
minikube kubectl -- port-forward svc/monitoring-grafana 3000:80 &

echo "Monitoring setup complete!"
echo "Access Grafana at http://localhost:3000"
echo "Default credentials:"
echo "Username: admin"
echo "Password: admin"
echo ""
echo "To check HPA status: minikube kubectl -- get hpa"
echo "To check metrics: minikube kubectl -- top pods"