# Getting Started with Kubernetes and Minikube
This repository contains a sample application that demonstrates how to deploy a simple service on a Kubernetes cluster using Minikube. This guide is based on the Docker "Getting Started" tutorial and aims to help users understand how to containerize an application and deploy it on Kubernetes.

The original application is based on the tutorial available at Docker Getting Started.

# Prerequisites
Before you begin, ensure that you have the following installed:
Docker
Minikube
kubectl

# 1. Create a New Kubernetes Cluster
First, you need to start Minikube, which will set up a local Kubernetes cluster on your machine.
"minikube start"

(This command initializes a Kubernetes cluster using Minikube. It sets up the necessary components and services needed to manage and deploy applications on Kubernetes.)

# 2. Build a New Docker Image
Next, we will build a Docker image for our sample application. The image will contain everything needed to run the app, such as the code and dependencies.
"docker build -t trivial-service:latest ."

(This command creates a Docker image from the contents of the current directory, using the Dockerfile. The -t flag tags the image with the name trivial-service:latest, which we'll use later in Kubernetes.)

# 3. Load the Image into Minikube
Once the image is built, it needs to be loaded into Minikube, since Minikube uses its own Docker environment separate from your local machine.

"minikube image load trivial-service:latest"

(This command makes the Docker image available within the Minikube cluster, allowing it to be used by Kubernetes for deploying your app.)

# 4. Deploy the Application
To deploy the application, we use a deployment.yaml file. This file defines how Kubernetes should manage the application, such as how many instances (pods) to run and which Docker image to use.

"kubectl apply -f deployment.yaml"

(This command applies the deployment.yaml configuration, telling Kubernetes to create a deployment based on the trivial-service image. It will create a pod that runs the application inside a container.)

# 5. Create a Kubernetes Service
After deploying the app, we need to expose it to the outside world. This is done by creating a service that maps the pod's internal port to an external port on your local machine.

"kubectl apply -f service.yaml"

(This command applies the service.yaml configuration, creating a service that routes traffic to the deployed application. It exposes the app to the cluster and makes it accessible via a specific URL.)

# 6. Access the Application
Now that the service is created, you can access the application running inside the Kubernetes cluster using Minikube's service URL.

"minikube service trivial-service --url"

(This command retrieves the URL where your application is accessible. Once you run this command, you'll get a URL that you can open in your web browser to interact with your application.)

# 7. Verify the Deployment
You can verify the status of your deployment and service by running the following commands:

"kubectl get deployments
kubectl get services"

(These commands will show you the running deployments and services, allowing you to ensure everything is working as expected.)