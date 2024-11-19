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
"docker build -t bb-demo ."

(This command creates a Docker image from the contents of the current directory, using the Dockerfile. The -t flag tags the image with the name trivial-service:latest, which we'll use later in Kubernetes.)

# 3. Load the Image into Minikube
Once the image is built, it needs to be loaded into Minikube, since Minikube uses its own Docker environment separate from your local machine.

"minikube image load bb-demo"

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

"minikube service bb-demo-service --url"

(This command retrieves the URL where your application is accessible. Once you run this command, you'll get a URL that you can open in your web browser to interact with your application.)

# 7. Verify the Deployment
You can verify the status of your deployment and service by running the following commands:

"kubectl get deployments
kubectl get services"

(These commands will show you the running deployments and services, allowing you to ensure everything is working as expected.)

# 8. Push the changes to the common github repository

# 9. Enable Ingress in Minikube
Ingress allows external traffic to reach the services within your Kubernetes cluster. To enable Ingress, run the following command:
"minikube addons enable ingress"

# 10. Build and Deploy the Services
We have multiple services in this project, and each one needs to be containerized with Docker, loaded into Minikube, and then deployed.

# 10.1. Deploy the Nginx Home Service
Build the Docker image for the Nginx Home service:
"docker build -t nginx-home-image ."

# 10.1.1. Load the image into Minikube:
"minikube image load nginx-home-image"

# 10.1.2. Deploy the Nginx Home service to the cluster:

"kubectl apply -f deployment.yaml
kubectl apply -f service.yaml"

# 10.2. Deploy the Data Nuxt App Service
# 10.2.1. Navigate to the data-nuxt-app directory:
"cd ./data-nuxt-app/"

# 10.2.2. Build the Docker image for the Data Nuxt App service:
"docker build -t data-nuxt-app-image ."

# 10.2.3. Load the image into Minikube:
"minikube image load data-nuxt-app-image"

# 10.2.4. Deploy the Data Nuxt App service to the cluster:
"kubectl apply -f deployment.yaml
kubectl apply -f service.yaml"

# 10.2.5. Apply the Ingress configuration for external access:
kubectl apply -f ./ingress.yaml

# 10.3. Deploy the Camera App Service
# 10.3.1. Navigate to the camera-app directory:
"cd ../camera-app/"

# 10.3.2. Build the Docker image for the Camera App service:
"docker build -t camera-app-image ."

# 10.3.3. Load the image into Minikube:
"minikube image load camera-app-image"

# 10.3.4. Deploy the Camera App service to the cluster:
"kubectl apply -f deployment.yaml
kubectl apply -f service.yaml"

# 10.4. Deploy the Map App Service
# 10.4.1. Navigate to the map-app directory:
"cd ../map-app/"

# 10.4.2. Build the Docker image for the Map App service:
"docker build -t map-app ."

# 10.4.3. Load the image into Minikube:
"minikube image load map-app"

# 10.4.4. Deploy the Map App service to the cluster:
"kubectl apply -f deployment.yaml
kubectl apply -f service.yaml"

# 11. Start Minikube Tunnel
Minikube’s tunnel feature allows you to make your services accessible outside the Minikube cluster. To start the tunnel, run:
"minikube tunnel"

This will expose your services and Ingress rules to external traffic.



<!-- mettre a jr un service ss impacter tous les autres (environnement de prod) faire ca en une seule cmd ?   -->
<!-- loco pour rust ? ?  -->

firstly minikube start 
then fill code backend and frontend
thencreate Dockerfile for in frontend folder
then Ensure Minikube is configured to use Docker by running: minikube -p minikube docker-env
then build image of backend : docker build -t my-backend-image
then build image of frontend : docker build -t my-frontend-image ./frontend
then minikube image load my-backend-image
then minikube image load my-frontend-image
verifie avec kubectl get pods
puis kubectl get services
puis access frontend via minikube service frontend-service
puis access frontend via minikube service backend-service

CETTE commande a fctionne :
minikube start --vm-driver=docker --no-vtx-check

minikube image load my-backend-image

FEEDBACK PROF:
" lui fournir un calcul et quil lenregistre de maniere periodik , comme formule excel quon lui donne et quon defini la freq a lakl il lexecute et lenregistre avec chak execution 
faut une db qui va calculer et sauver a intervalle regulier, 
frontend , ajouter calcule, afficher evolution du calcul en fct du temps 
une des formules c renvoyer de voitures rouges a tel t ou pdt tel interval tps, envoyer des requetes aux autres microservices 
table de logs montrant des infos concernant les connexion si ct bon, si failed, etc et a enregistrer ds db  (un log pr chacune des formules ) "

group cam: detecte plaque , heure, la cam qui a detecte 