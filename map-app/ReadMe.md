# Steps to Deploy a "Hello World" App on Kubernetes

By Thibaut François

## Introduction

This guide outlines the steps to deploy a simple "Hello World" application on a Kubernetes cluster using Minikube. This setup is beginner-friendly and serves as a practical introduction to Kubernetes.

## Setting Up Kubernetes Locally

To deploy the app, you first need a local Kubernetes cluster. For this purpose, we will use **Minikube**.

### 1. Install Minikube

You can easily install Minikube using Homebrew. Run the following command:

```bash
brew install minikube
```

### 2. Start Minikube

After installing Minikube, start your cluster with:

```bash
minikube start
```

### 3. Verify Minikube Status

You can check the status of the Minikube cluster using:

```bash
kubectl get nodes
```

or:

```bash
minikube status
```

## Creating a Simple "Hello World" Docker Application

Next, create a simple application that responds with "Hello, World!". You can use Flask or a built-in Python HTTP server.

### Using Flask

Create a file named `app.py` with the following content:

```python
# app.py
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

### Alternative: Using Python's Built-in HTTP Server

If you prefer not to use Flask, you can use Python’s built-in HTTP server:

```python
from http.server import BaseHTTPRequestHandler, HTTPServer

class HelloWorldHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Send a 200 OK response
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        # Send the response body
        self.wfile.write(b"Hello, World!")

def run(server_class=HTTPServer, handler_class=HelloWorldHandler, port=5000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Starting HTTP server on port {port}...')
    httpd.serve_forever()

if __name__ == '__main__':
    run()
```

### Creating the Dockerfile

To containerize the application, create a `Dockerfile` in the same directory:

```dockerfile
# Dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY app.py /app
RUN pip install flask
CMD ["python", "app.py"]
```

## Building the Docker Image

Before building the Docker image, ensure that you are connected to Minikube's Docker environment:

```bash
eval $(minikube docker-env)
```

Then, build the Docker image using the following command:

```bash
docker build -t hello-k8s .
```

To verify that the image was successfully created, list your Docker images:

```bash
docker images
```

## Creating a Kubernetes Deployment

A Deployment defines the desired state for your application, including the number of replicas and update strategies. Create a `deployment.yaml` file with the following content:

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-k8s-deployment
spec:
  replicas: 1 # Number of app instances
  selector:
    matchLabels:
      app: hello-k8s
  template:
    metadata:
      labels:
        app: hello-k8s
    spec:
      containers:
        - name: hello-k8s
          image: hello-k8s # The Docker image we just built
          imagePullPolicy: Never
          ports:
            - containerPort: 5000
```

Deploy the application to Kubernetes with the following command:

```bash
kubectl apply -f deployment.yaml
```

### Checking the Deployment

You can check the status of your deployment and pods using:

```bash
kubectl get deployments
kubectl get pods
```

The output should show that your pod is running:

```
NAME                                    READY   STATUS    RESTARTS       AGE
hello-k8s-deployment-866659cd9f-d7lsh   1/1     Running   0              8s
```

## Exposing Your App with a Kubernetes Service

To make your application accessible from outside the Kubernetes cluster, you need to create a Service. Create a `service.yaml` file with the following content:

```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: hello-k8s-service
spec:
  selector:
    app: hello-k8s # Match the label from Deployment
  ports:
    - protocol: TCP
      port: 80
      targetPort: 5000 # Forward traffic to the container’s port
  type: LoadBalancer # Use this to expose the service outside the cluster
```

Apply the service configuration using:

```bash
kubectl apply -f service.yaml
```

### Accessing Your Application

Finally, retrieve the service URL to access your application:

```bash
minikube service hello-k8s-service --url
```

Open the provided URL in your browser, and you should see "Hello, World!" displayed.

## When You're Finished Working

Stop Minikube:

If you want to stop your Minikube cluster when you’re done, use:
bash

```bash
minikube stop
```

This command will stop the Minikube VM but keep your configurations and state.

You can reopen it later with :

```bash
minikube sart
```

## Modifing the Application

After making changes to your app.py code you have to rebuild your Docker image:

```bash
docker build -t hello-k8s .
```

And reapply the deployment to update your running application.

## Conclusion

Thank you for reading this. You have successfully deployed a "Hello World" application on Kubernetes using Minikube.

# Proxy - Deployment of all the application

## Ingress

The Ingress resource in Kubernetes is used to manage external access to services within a cluster. An Ingress can route traffic to multiple services based on URL paths, allowing you to expose multiple applications behind a single domain (or IP address).

In this case, your ingress.yaml is a configuration file that uses NGINX as the ingress controller to proxy traffic to multiple applications (like data-nuxt-app, nginx-home-service, map-app, and camera-app) based on the URL path.

```yaml
spec:
  ingressClassName: nginx
  rules:
    - http:
        paths:
          - path: /data-nuxt-app(/|$)(.*)
            pathType: ImplementationSpecific
            backend:
              service:
                name: data-nuxt-app-service
                port:
                  number: 80
          - path: /
            pathType: ImplementationSpecific
            backend:
              service:
                name: nginx-home-service
                port:
                  number: 80
          - path: /map-app(/|$)(.*)
            pathType: ImplementationSpecific
            backend:
              service:
                name: map-app-service
                port:
                  number: 80
          - path: /camera-app(/|$)(.*)
            pathType: ImplementationSpecific
            backend:
              service:
                name: camera-app-service
                port:
                  number: 80
```

## Resume

- Start minikube

```bash
minikube start
```

- Build the Docker Image

```bash
docker build -t $IMAGE_NAME .
```

- Deploy
  The deployment create the pods and inside the pods create the containers based on the Docker Image.
  The service expose the pods on HTTP

```bash
kubectl apply -f ./deployment.yaml && kubectl apply -f ./service.yaml
```
