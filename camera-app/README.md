# Distributed Systems Project
### Made by:
- Corentin Maillard
- Mourad Mettioui

## Description
This Git repository is used for the development of the **camera** component of our distributed systems project. The application uses Docker Desktop and runs on Kubernetes.

## Getting Started
### How to Create an Image
There is an image to create: 
1. **`camera-app-image`**: This will be our main pod for the camera feature in the future.

To build the images, run the following commands:

```
docker build -t camera-app-image .
```

### Start Minikube and Load the Images

First, you need to start Minikube with the following command:

```
minikube start
```

You can also launch the Minikube dashboard with:

```
minikube dashboard
```

After that, to load the images into Minikube, use the following commands:

```
minikube image load camera-app-image
```

### Create Pods with yaml file
We are going to create pods using the image that we loaded and the YAML files for the camera-app:

```
kubectl apply -f crds.yaml
kubectl apply -f operator.yaml
kubectl apply -f client-insecure-operator.yaml
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f example.yaml

```

We are going to create pods using the YAML files for the cockroachDB:

```
kubectl apply -f crds.yaml
kubectl apply -f operator.yaml
kubectl apply -f client-insecure-operator.yaml
kubectl apply -f example.yaml

```
Be carefull, the operator pod must first be up and running before you can create the pod for the database with example.yaml


If you're running Minikube with Docker Desktop as the container driver, a Minikube tunnel is needed because containers inside Docker Desktop are isolated from your host computer. You will have to open a new terminal for each of the following commands:

```
minikube tunnel
```

You only need to click on the HTTP link generated to open the pages.

### Communication between pods
Here is the list of API available for this project


The api to fetch all the cameras
```
http://camera-app-service/api/cameras
```
Here is what you will obtained
```
  id           Int      @id @default(sequence())
  available    String   #true or false
  cameraname   String   
  cameranumber String   
  position     Int[]
```

The API to create a new camera
```
http://camera-app-service/api/add-camera
```
Here is an exemple of what you can post with postman

![image](https://github.com/user-attachments/assets/51cf17d1-e391-41de-a425-ce93fbaaf7ec)


## documentation
link : "https://htmlpreview.github.io/?https://github.com/ChillinSoul/Distributed-Systems/blob/main/camera-app/docs/index.html"
