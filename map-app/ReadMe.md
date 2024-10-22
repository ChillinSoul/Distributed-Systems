# Map Application

By Thibaut François

## Introduction

The **Map Application** is a part of the **Brussels Traffic Monitoring** project, focusing on analyzing traffic in Brussels for improved mobility and sustainable development. This application allows users to visualize the map, view routes, and access the quickest paths between locations.

## Features

- **Interactive Map**: Users can view a detailed map of Brussels at [http://localhost/map-app](http://localhost/map-app).
- **Route Visualization**: The application computes and displays routes.
- **Shortest Path Calculation**: Find the most efficient path between points.
- **API Access**: Access map data via the API at [http://localhost/map-app/api](http://localhost/map-app/api).

## Deployment Instructions

### Prerequisites

- **Minikube**: Ensure that Minikube is installed on your machine. You can install it using Homebrew:

  ```bash
  brew install minikube
  ```

- **Docker**: Make sure Docker is installed and running on your system.

### Steps to Deploy

1. **Start Minikube**:

   ```bash
   minikube start
   ```

2. **Set Permissions**:

   Before running the deployment scripts for the first time, give execute permissions to the necessary scripts:

   ```bash
   chmod +x deploy.sh clean.sh
   ```

3. **Deploy the Application**:

   From the root directory of the project, run:

   ```bash
   ./deploy.sh
   ```

4. **Start the Minikube Tunnel**:

   This command will expose your services:

   ```bash
   minikube tunnel
   ```

5. **Cleanup**:

   To clean up your deployments, you can run:

   ```bash
   ./clean.sh
   ```

## Deployment Script Overview

The `deploy.sh` script automates the deployment process and consists of the following steps:

- **Check if Minikube is Running**: The script verifies that Minikube is active before proceeding.
- **Configure Docker**: It sets Docker to use Minikube's Docker daemon.
- **Build Docker Image**: It builds the Docker image for the application.
- **Apply Kubernetes Configurations**: It deploys the application to Kubernetes using the specified YAML configuration files.

### Cleanup Script Overview

The `clean.sh` script is responsible for cleaning up the Kubernetes resources associated with your application. It deletes the deployments and services as defined in the configuration files.

## Conclusion

The Map Application serves as a crucial component in the broader **Brussels Traffic Monitoring** project, utilizing modern technologies like Kubernetes and Docker for deployment. By following the provided instructions, you can deploy and run the application locally and access the map and its API.
