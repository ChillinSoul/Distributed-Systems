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
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
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

### Create the database and the table

First you need to connect to the database for this use the following command:

```
kubectl exec -it cockroachdb-client-insecure -- ./cockroach sql --insecure --host=cockroachdb-public
```

Once you have open the CockroachDB SQL shell, you can create the database **cameradata** and the table **camera** with the following SQL command:

```
CREATE DATABASE cameradata;
USE cameradata;
CREATE TABLE camera (
    id INT PRIMARY KEY DEFAULT unique_rowid(),
    available VARCHAR(255),
    cameraname VARCHAR(255),
    cameranumber VARCHAR(255),
    position INTEGER[]
);
INSERT INTO camera (available, cameraname, cameranumber, position)
VALUES ('yes', 'Camera A', '123', '{"10", "30"}');

CREATE TABLE video (
    id INT PRIMARY KEY DEFAULT unique_rowid(),
    cameranumber VARCHAR(255),
    numberplate VARCHAR(255),
    typevehicule VARCHAR(255),
    createat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO video (cameranumber, numberplate, typevehicule)
VALUES ('C001', '1-LOL-666', 'voiture');
```

### Difficulties encountered

1. Next.js does not work very well for this project because if your ingress configuration includes anything other than a prefix for the pathType and a / or the path, it will not function correctly.
There are two solutions to this problem:
- First, use Next.js's SSR (Server-Side Rendering) to fetch data directly from your service's API. However, you will not be able to perform POST requests to your API.

- Second, create another ingress where you define a new host. This allows you to use your API without any issues.

  Here is an example:
  
  ```
  other ingress
  
  ---

  apiVersion: networking.k8s.io/v1
  kind: Ingress
  metadata:
    name: services-ingress
    annotations:
      nginx.ingress.kubernetes.io/use-regex: "true"
  spec:
    ingressClassName: nginx
    rules:
      - host: camera-app-host
        http:
          paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: camera-app-service
                port:
                  number: 80
  ```
  
  The second solutions was chosen since we needed to be able to push new camera and video in the database using the API.

2. When using Prisma with Kubernetes, no operations can be performed on the database until it is properly defined in the StatefulSet. Since the instructions required the database to be defined within the StatefulSet, this issue was resolved by itself.

3. We could not update the docker image proprely and we used to delete the minikube before recreating it.
   Solution: we found the correct command to update the image of our application.
   
   ```
   #for each new image the V2 need to increase its number (V3, V4, etc)
   docker build -t camera-app-image:V2 .

   #correspond to kubectl set image deployment/my-deployment my-container=my-image:latest-created
   kubectl set image deployment/camera-app camera-app=camera-app-image:V2
   ```
   
   

### Communication between pods

Here is the list of API available for this project

=============================================================

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

![image](https://github.com/user-attachments/assets/25eefa96-1a69-4a22-b57d-1a251393f696)

=============================================================

The API to create a new camera

```
http://camera-app-service/api/add-camera
```

Here is an exemple of what you can post with postman

![image](https://github.com/user-attachments/assets/51cf17d1-e391-41de-a425-ce93fbaaf7ec)

=============================================================

The api to fetch all the videos

```
http://camera-app-service/api/videos
```

Here is what you will obtained

```
id              Int   @id @default(sequence())
cameranumber    String    
numberplate     String
typevehicule    String
createat        DateTime
```

![image](https://github.com/user-attachments/assets/b3dc45ea-efe4-45aa-ba7d-c07930c963b0)

=============================================================

The API to create a new video

```
http://camera-app-service/api/create-video
```

Here is an exemple of what you can post with postman

Without setting a date

![image](https://github.com/user-attachments/assets/ca3313ac-5770-46d3-a169-39527fa2ba6d)

With a define date

![image](https://github.com/user-attachments/assets/04e5d395-34a7-49be-8ecc-27d05dfc06ca)


=============================================================

For more information you can consult the documentation

## Documentation

link : "https://mouradmettioui.github.io/API-Documentation/#/"
