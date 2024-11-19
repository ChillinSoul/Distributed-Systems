# Distributed Systems Project
### Made by:
- Corentin Maillard
- Mourad Mettioui

## Description
This Git repository is used for the development of the **camera** component of our distributed systems project. The application uses Docker Desktop and runs on Kubernetes.

## Getting Started
### How to Create an Image
There are two images to create: 
1. **`getting-started`**: This will be our main pod for the camera feature in the future.
2. **`test-second-pod`**: A test pod used to experiment with DNS-based communication (details explained further below).

To build the images, run the following commands:

```
docker build -t getting-started .
docker build -t test-second-pod .
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
minikube image load getting-started
minikube image load test-second-pod
```

### Create Pods with yaml file
We are going to create 2 pods using the images that we loaded and the YAML files **`bb.yaml`** and **`second_test.yaml`**:

```
kubectl apply -f bb.yaml
kubectl apply -f second_test.yaml
```

If you're running Minikube with Docker Desktop as the container driver, a Minikube tunnel is needed because containers inside Docker Desktop are isolated from your host computer. You will have to open a new terminal for each of the following commands:

```
minikube service bb-entrypoint --url
minikube service second-entrypoint --url
```

You only need to click on the HTTP link generated to open the pages.

### Communication between pods
The communication is done by using the DNS of the pods. If you add an item on the page corresponding to the bb-entrypoint service, it will also communicate and add the item to the second-entrypoint service in the second-demo pod.

The code for that is present in the "getting-started-app/src/index.js" file

```
const axios = require('axios');  // Add axios for making HTTP requests
//DNS of second service
const SECOND_SERVICE_URL = 'http://second-entrypoint.default.svc.cluster.local:4000';

app.post('/items', async (req, res) => {
    // Call the original addItem function
    await addItem(req, res);
    
    // Synchronize with the second-entrypoint service
    try {
        await axios.post(`${SECOND_SERVICE_URL}/items`, req.body);
        console.log('Item successfully synchronized with second-entrypoint');
    } catch (error) {
        console.error('Error synchronizing with second-entrypoint:', error.message);
    }
});
```
## documentation
link : "https://htmlpreview.github.io/?https://github.com/ChillinSoul/Distributed-Systems/blob/main/camera-app/docs/index.html"
