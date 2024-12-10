#!/bin/bash
# k8s/monitoring/setup-monitoring.sh

# Exit on any error
set -e

echo "Setting up monitoring infrastructure and tools..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to detect system architecture and OS
detect_system() {
    # Get the operating system type
    local os=$(uname -s | tr '[:upper:]' '[:lower:]')
    
    # Get the CPU architecture
    local arch=$(uname -m)
    
    # Convert architecture names to match k9s naming convention
    case "${arch}" in
        x86_64)
            arch="amd64"
            ;;
        aarch64)
            arch="arm64"
            ;;
        armv7l)
            arch="arm"
            ;;
    esac
    
    # Convert OS names to match k9s naming convention
    case "${os}" in
        linux)
            os="Linux"
            ;;
        darwin)
            os="Darwin"
            ;;
        mingw* | cygwin* | msys*)
            os="Windows"
            ;;
    esac
    
    echo "${os}_${arch}"
}

# Install k9s if not already installed
if ! command_exists k9s; then
    echo "Installing k9s..."
    
    # Detect system type and architecture
    SYSTEM_INFO=$(detect_system)
    echo "Detected system: ${SYSTEM_INFO}"
    
    # Set the download URL based on system info
    K9S_VERSION="v0.27.4"
    DOWNLOAD_URL="https://github.com/derailed/k9s/releases/download/${K9S_VERSION}/k9s_${SYSTEM_INFO}.tar.gz"
    
    echo "Downloading k9s from: ${DOWNLOAD_URL}"
    
    # Download and install k9s
    if wget "${DOWNLOAD_URL}"; then
        tar -xf "k9s_${SYSTEM_INFO}.tar.gz"
        sudo mv k9s /usr/local/bin
        rm "k9s_${SYSTEM_INFO}.tar.gz"
        echo "k9s installed successfully!"
    else
        echo "Failed to download k9s. Please check the system detection or try manual installation."
        exit 1
    fi
fi

# Rest of your original script remains the same...
EOF

# Enable metrics server if not already enabled
echo "Ensuring metrics-server is enabled..."
minikube addons enable metrics-server

# Wait for metrics-server to be ready
echo "Waiting for metrics-server to be ready..."
minikube kubectl -- -n kube-system rollout status deployment metrics-server

# Create HPA configuration
echo "Creating HPA configuration..."
cat <<EOF | minikube kubectl -- apply -f -
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: data-nuxt-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: data-nuxt-app
  minReplicas: 1
  maxReplicas: 5
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 10
    scaleDown:
      stabilizationWindowSeconds: 10
EOF

# Display usage instructions
echo -e "\n=== Monitoring Setup Complete ===\n"
echo "Here's how to use your monitoring tools:"
echo ""
echo "1. To open k9s monitoring dashboard:"
echo "   $ k9s"
echo ""
echo "2. Inside k9s:"
echo "   - Press '0' to see all resources"
echo "   - Type 'hpa' and press Enter to see autoscalers"
echo "   - Type 'pod' and press Enter to see pods"
echo "   - Press '?' for help"
echo ""
echo "3. To watch HPA status directly:"
echo "   $ minikube kubectl -- get hpa data-nuxt-app-hpa -w"
echo ""
echo "4. To test HPA scaling:"
echo "   Run this in a separate terminal:"
echo "   $ minikube kubectl -- run -i --tty load-generator --rm --image=busybox --restart=Never -- /bin/sh -c \"while sleep 0.01; do wget -q -O- http://data-nuxt-app-service/data-nuxt-app/data-view; done\""
echo ""
echo "Note: It may take a few minutes for metrics to become available."
echo "If you don't see metrics right away, wait 2-3 minutes and try again."

# Check if metrics are available
sleep 30
if minikube kubectl -- top nodes >/dev/null 2>&1; then
    echo -e "\nMetrics are now available! You can start monitoring."
else
    echo -e "\nMetrics might take a few more minutes to become available."
    echo "If you still don't see metrics after 5 minutes, try restarting the metrics-server:"
    echo "$ minikube kubectl -- -n kube-system rollout restart deployment metrics-server"
fi