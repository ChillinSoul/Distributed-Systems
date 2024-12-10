# Map Application

By Thibaut François & Jordan Hermans

---

![alt text](/map-app/assets/mapPreview.png)

## Introduction

The **Map Application** is part of the **Brussels Traffic Monitoring** project, designed to analyze traffic in Brussels for improved mobility and sustainable development. This application offers the following features:

- Visualize a detailed map with all roads and intersections.
- Access the shortest paths between locations.
- Dynamically add new roads to the map.
- Mark roads as unusable (e.g., due to roadwork).
- Delete roads from the map.
- Manage road directionality by marking roads as one-way and specifying their direction.
- Add new roads.

---

## Deployment Instructions

### Prerequisites

- **Minikube**: Ensure Minikube is installed on your machine.
- **Docker**: Verify that Docker is installed and running.

---

### Steps to Deploy

#### 1. Start Minikube

Start the Minikube environment:

```bash
minikube start
```

---

#### 2. Deploy the Application

##### For macOS:

1. Set execute permissions for the deployment scripts:

   ```bash
   chmod +x deploy.sh clean.sh
   ```

2. Run the deployment script from the root directory:

   ```bash
   ./deploy.sh
   ```

##### For Windows:

Manually execute these commands:

1. **Deploy `nginx-home`**:

   ```bash
   cd ./nginx-home/
   docker build -t nginx-home-image .
   minikube image load nginx-home-image
   kubectl apply -f deployment.yaml
   kubectl apply -f service.yaml
   cd ..
   ```

2. **Deploy `data-nuxt-app`**:

   ```bash
   cd ./data-nuxt-app/
   docker build -t data-nuxt-app-image .
   minikube image load data-nuxt-app-image
   kubectl apply -f deployment.yaml
   kubectl apply -f service.yaml
   kubectl apply -f ingress.yaml
   cd ..
   ```

3. **Deploy `camera-app`**:

   ```bash
   cd ./camera-app/
   docker build -t camera-app-image .
   minikube image load camera-app-image
   kubectl apply -f deployment.yaml
   kubectl apply -f service.yaml
   cd ..
   ```

4. **Deploy `map-app`**:
   ```bash
   cd ./map-app/
   docker build -t map-app .
   minikube image load map-app
   kubectl apply -f deployment.yaml
   kubectl apply -f service.yaml
   minikube addons enable ingress
   cd ..
   ```

---

#### 3. Create the Database

1. Apply database configurations:

   ```bash
   kubectl apply -f crds.yaml
   kubectl apply -f operator.yaml
   ```

2. Wait for the operator to initialize, then execute:

   ```bash
   kubectl apply -f example.yaml
   kubectl apply -f client-insecure-operator.yaml
   kubectl exec -it cockroachdb-client-insecure -- ./cockroach sql --certs-dir=/cockroach/cockroach-certs --insecure --host=cockroachdb-public
   ```

3. Inside the CockroachDB SQL terminal, run:

   ```sql
   CREATE DATABASE map;
   USE map;

   CREATE TABLE intersections (
      id INT PRIMARY KEY,
      name VARCHAR(10) NOT NULL,
      x_coordinate INT NOT NULL,
      y_coordinate INT NOT NULL
   );

   CREATE TABLE roads (
      id INT PRIMARY KEY DEFAULT unique_rowid(),
      start_intersection INT NOT NULL,
      end_intersection INT NOT NULL,
      length INT NOT NULL,
      useable BOOLEAN DEFAULT TRUE,
      one_way BOOLEAN DEFAULT FALSE,
      direction VARCHAR(20) DEFAULT NULL,
      FOREIGN KEY (start_intersection) REFERENCES intersections(id),
      FOREIGN KEY (end_intersection) REFERENCES intersections(id)
   );

   INSERT INTO intersections (id, name, x_coordinate, y_coordinate) VALUES
   (1, 'A', 250, 400), (2, 'B', 350, 400), (3, 'C', 450, 400),
   (4, 'D', 550, 400), (5, 'E', 150, 300), (6, 'F', 250, 300),
   (7, 'G', 350, 300), (8, 'H', 450, 300), (9, 'I', 550, 300),
   (10, 'J', 150, 200), (11, 'K', 250, 200), (12, 'L', 350, 200),
   (13, 'M', 450, 200), (14, 'N', 550, 200), (15, 'O', 250, 100),
   (16, 'P', 350, 100), (17, 'Q', 450, 100), (18, 'R', 100, 400),
   (19, 'S', 100, 500), (20, 'T', 250, 500), (21, 'U', 550, 500),
   (22, 'V', 650, 400), (23, 'W', 650, 300), (24, 'X', 650, 200),
   (25, 'Y', 550, 100);

   INSERT INTO roads (id, start_intersection, end_intersection, length, useable, one_way, direction) VALUES
   (1, 1, 2, 100, TRUE, FALSE, NULL), (2, 2, 3, 100, FALSE, FALSE, NULL),
   (3, 3, 4, 100, TRUE, FALSE, NULL), (4, 1, 6, 100, TRUE, TRUE, 'start_to_end'),
   (5, 6, 7, 100, TRUE, FALSE, NULL), (6, 7, 8, 100, FALSE, FALSE, NULL);

   \q
   ```

---

#### 4. Start the Minikube Tunnel

Expose services to your local environment:

```bash
minikube tunnel
```

---

#### 5. Cleanup

To remove all deployments, use:

```bash
./clean.sh
```

## Deployment Script Overview

The `deploy.sh` script automates the deployment process and consists of the following steps:

- **Check if Minikube is Running**: The script verifies that Minikube is active before proceeding.
- **Configure Docker**: It sets Docker to use Minikube's Docker daemon.
- **Build Docker Image**: It builds the Docker image for the application.
- **Apply Kubernetes Configurations**: It deploys the application to Kubernetes using the specified YAML configuration files.

## API Access

### 1. Get Map Data

Retrieve all roads and intersections, including their details such as usability, one-way status, and direction.

- **Endpoint**:
  `http://localhost/map-app/api/map-data`

- **Method**:
  `GET`

- **How to Use**:
  Run the following command in your terminal to access the data:

```bash
curl -X GET http://localhost/map-app/api/map-data
```

- **Response Format**:
  The API responds with a JSON object containing two arrays:

  - **`intersections`**: Each intersection includes:

    - `id`: Unique identifier of the intersection.
    - `name`: Name of the intersection.
    - `x_coordinate`: X-coordinate of the intersection on the map.
    - `y_coordinate`: Y-coordinate of the intersection on the map.

  - **`roads`**: Each road includes:
    - `id`: Unique identifier of the road.
    - `start_intersection`: ID of the intersection where the road starts.
    - `end_intersection`: ID of the intersection where the road ends.
    - `length`: Length of the road.
    - `useable`: Boolean indicating whether the road is accessible.
    - `one_way`: Boolean indicating whether the road is one-way.
    - `direction`: Direction of the one-way road (`start_to_end` or `end_to_start`), or `null` if not one-way.

---

- **Example Response**:

```json
{
  "intersections": [
    { "id": 1, "name": "A", "x_coordinate": 250, "y_coordinate": 400 },
    { "id": 2, "name": "B", "x_coordinate": 350, "y_coordinate": 400 },
    { "id": 3, "name": "C", "x_coordinate": 450, "y_coordinate": 400 },
    ...
  ],
  "roads": [
    { "id": 1, "start_intersection": 1, "end_intersection": 2, "length": 100, "useable": true, "one_way": false, "direction": null },
    { "id": 2, "start_intersection": 2, "end_intersection": 3, "length": 100, "useable": false, "one_way": false, "direction": null },
    { "id": 3, "start_intersection": 1, "end_intersection": 6, "length": 100, "useable": true, "one_way": true, "direction": "start_to_end" },
    ...
  ]
}

```

---

- **Errors**:
  - **500 Internal Server Error**:  
    If there is an issue fetching the data from the database:  
    `{ "error": "Error fetching data." }`

This API provides a comprehensive overview of the map's intersections and roads, including details such as one-way restrictions and road usability.

### 2. Find the Shortest Path

This API calculates the shortest path between two intersections using Dijkstra's algorithm. The response includes a list of intersections that need to be traversed in order to go from the start to the end intersection.

- **Endpoint**:
  `http://localhost/map-app/api/shortest-path`

- **Method**:
  `GET`

- **How to Use**:
  Provide the IDs of the start and end intersections as query parameters (`start` and `end`):

```bash
curl -X GET "http://localhost/map-app/api/shortest-path?start=<start-id>&end=<end-id>"
```

Replace `<start-id>` and `<end-id>` with the actual intersection IDs.

- **Parameters**:

  - `start`: ID of the starting intersection.
  - `end`: ID of the destination intersection.

- **Response Format**:
  The API returns an array of intersections, representing the shortest path.

- **Example Command**:

```bash
curl -X GET "http://localhost/map-app/api/shortest-path?start=16&end=21"
```

- **Example Response**:

```json
[
  { "id": 16, "name": "P", "x_coordinate": 350, "y_coordinate": 100 },
  { "id": 17, "name": "Q", "x_coordinate": 450, "y_coordinate": 100 },
  ...
  { "id": 21, "name": "U", "x_coordinate": 550, "y_coordinate": 500 }
]
```

This response indicates that to travel from intersection 16 to 21, you need to pass through intersections 16, 17, ... and 21.

- **Errors**:
  - **400 Bad Request**:  
    If `start` or `end` intersection IDs are missing or invalid:  
    `{ "error": "Start and End intersection IDs are required and must be valid numbers." }`
  - **500 Internal Server Error**:  
    If the server encounters an unexpected issue (e.g., calculation error or database issue):  
    `{ "error": "Error calculating route." }`

### 3. Update Road Usability

This API allows you to mark a road as usable or not usable. It is helpful for signaling road closures due to maintenance or construction.

- **Endpoint**:
  `http://localhost/map-app/api/update-road`

- **Method**:
  `POST`

- **How to Use**:
  Provide the road ID and its new usability status (`true` or `false`) as query parameters:

```bash
curl -X POST "http://localhost/map-app/api/update-road?id=<road-id>&useable=<true|false>"
```

Replace `<road-id>` with the road's ID and `<true|false>` with the desired status:

- `true`: The road is usable.
- `false`: The road is not usable.

- **Parameters**:

  - `id`: The ID of the road to update.
  - `useable`: The new status of the road (true or false).

- **Response Format**:
  The API returns a JSON object containing a confirmation message and the updated road details.

- **Example Command**:

```bash
curl -X POST "http://localhost/map-app/api/update-road?id=1&useable=false"
```

- **Example Response**:

```json
{
  "message": "Road updated successfully.",
  "road": {
    "id": 1,
    "start_intersection": 1,
    "end_intersection": 2,
    "length": 100,
    "useable": false
  }
}
```

- **Errors**:
  - **400 Bad Request**:  
    If the `id` of the road is missing or invalid:  
    `{ "error": "A valid road ID is required." }`
  - **500 Internal Server Error**:  
    If the road cannot be updated due to an unexpected issue:  
    `{ "error": "Failed to update road." }`

### 4. Delete a Road

This API allows you to delete a specific road from the database using its `id`. It is useful for cleaning up unnecessary or incorrect data from the system.

- **Endpoint**:
  `http://localhost/map-app/api/delete-road`

- **Method**:
  `DELETE`

- **How to Use**:
  Provide the ID of the road to delete as a query parameter (`id`):

```bash
curl -X DELETE "http://localhost/map-app/api/delete-road?id=<road-id>"
```

Replace `<road-id>` with the ID of the road you want to delete.

- **Parameters**:

  - `id` (required): The ID of the road to delete.

- **Response Format**:
  On successful deletion, the API returns the details of the deleted road.

- **Example Command**:

```bash
curl -X DELETE "http://localhost/map-app/api/delete-road?id=1"
```

- **Example Response (Success)**:

```json
{
  "message": "Road deleted successfully.",
  "road": {
    "id": 1,
    "start_intersection": 1,
    "end_intersection": 2,
    "length": 100,
    "useable": true
  }
}
```

- **Errors**:
  - **400 Bad Request**:  
    If the `id` of the road is missing or invalid:  
    `{ "error": "A valid road ID is required." }`
  - **500 Internal Server Error**:  
    If the road cannot be deleted due to an unexpected issue:  
    `{ "error": "Failed to delete road.", "details": "<error-message>" }`

### 5. Mark a Road as One-Way

This API allows you to mark an existing road as a one-way street and specify its direction.

- **Endpoint**:  
  `http://localhost/map-app/api/one-way`

- **Method**:  
  `POST`

- **How to Use**:  
  Provide the required parameters as query parameters in the URL:

```bash
curl -X POST "http://localhost/map-app/api/one-way?id=<road-id>&one_way=<true|false>&direction=<start_to_end|end_to_start>"
```

Replace the following placeholders:

- `<road-id>`: The ID of the road to update.
- `<true|false>`: Whether the road is a one-way street (`true` or `false`).
- `<start_to_end|end_to_start>`: The direction of the one-way street, required if `one_way=true`.

---

- **Parameters**:

  | Parameter   | Type      | Required | Description                                                                                   |
  | ----------- | --------- | -------- | --------------------------------------------------------------------------------------------- |
  | `id`        | `int`     | Yes      | ID of the road to update.                                                                     |
  | `one_way`   | `boolean` | Yes      | Set to `true` to mark the road as one-way, or `false` to disable one-way.                     |
  | `direction` | `string`  | Yes\*    | Direction of the one-way road (`start_to_end` or `end_to_start`). Required if `one_way=true`. |

---

- **Response Format**:  
  On success, the API returns the updated road details.

- **Example Command**:

Mark a road as one-way from start to end:

```bash
curl -X POST "http://localhost/map-app/api/one-way?id=1&one_way=true&direction=start_to_end"
```

Disable one-way for a road:

```bash
curl -X POST "http://localhost/map-app/api/one-way?id=1&one_way=false"
```

---

- **Example Response (Success)**:

```json
{
  "message": "Road updated successfully.",
  "road": {
    "id": 1,
    "start_intersection": 1,
    "end_intersection": 2,
    "length": 100,
    "useable": true,
    "one_way": true,
    "direction": "start_to_end"
  }
}
```

---

- **Error Responses**:

  - **Missing or Invalid Parameters**: If `id`, `one_way`, or `direction` (when required) is missing or invalid:
    `{ "error": "For one-way roads, a valid direction ('start_to_end' or 'end_to_start') is required." }`

  - **Road Not Found**: If the specified road ID does not exist:
    `{ "error": "Road with ID <road-id> does not exist." }`

  - **Server Error**: If an unexpected issue occurs on the server:
    `{ "error": "Failed to update road." }`

---

This API allows you to manage road direction dynamically, ensuring accurate traffic data representation. Ensure that the provided `road-id` exists in the database and that the `direction` parameter is used only for one-way streets.

### 6. Create a New Road

This API allows you to create a new road by specifying the start and end intersections, length, usability, and optionally whether it is a one-way street and its direction.

- **Endpoint**:  
  `http://localhost/map-app/api/new-road`

- **Method**:  
  `POST`

- **How to Use**:  
  Provide the required parameters as query parameters in the URL:

```bash
curl -X POST "http://localhost/map-app/api/new-road?start_intersection=<start-id>&end_intersection=<end-id>&length=<length>&useable=<true|false>&one_way=<true|false>&direction=<start_to_end|end_to_start>"
```

Replace the following placeholders:

- `<start-id>`: ID of the intersection where the road starts.
- `<end-id>`: ID of the intersection where the road ends.
- `<length>`: Length of the road in arbitrary units (e.g., meters).
- `<true|false>`: Whether the road is usable or not (default is `true`).
- `<true|false>`: Whether the road is a one-way street (default is `false`).
- `<start_to_end|end_to_start>`: Direction of the one-way street (required only if `one_way=true`).

---

- **Parameters**:

  | Parameter            | Type      | Required | Description                                            |
  | -------------------- | --------- | -------- | ------------------------------------------------------ |
  | `start_intersection` | `int`     | Yes      | ID of the starting intersection of the road.           |
  | `end_intersection`   | `int`     | Yes      | ID of the ending intersection of the road.             |
  | `length`             | `int`     | Yes      | Length of the road.                                    |
  | `useable`            | `boolean` | No       | Specifies if the road is usable (default is `true`).   |
  | `one_way`            | `boolean` | No       | Specifies if the road is one-way (default is `false`). |
  | `direction`          | `string`  | No\*     | Specifies the direction if the road is one-way.        |

---

- **Response Format**:  
  On success, the API returns the details of the newly created road.

- **Example Command**:

Create a two-way road:

```bash
curl -X POST "http://localhost/map-app/api/new-road?start_intersection=1&end_intersection=2&length=100&useable=true"
```

Create a one-way road:

```bash
curl -X POST "http://localhost/map-app/api/new-road?start_intersection=1&end_intersection=2&length=100&useable=true&one_way=true&direction=start_to_end"
```

---

- **Example Response (Success)**:

```json
{
  "message": "Road created successfully.",
  "road": {
    "id": 31,
    "start_intersection": 1,
    "end_intersection": 2,
    "length": 100,
    "useable": true,
    "one_way": true,
    "direction": "start_to_end"
  }
}
```

---

- **Error Responses**:

  - **Missing or Invalid Parameters**:  
    `{ "error": "Valid start_intersection, end_intersection, and length are required." }`

  - **Same Intersections**:  
    `{ "error": "Start and end intersections must be different." }`

  - **Missing Direction for One-Way Road**:  
    `{ "error": "For one-way roads, a valid direction ('start_to_end' or 'end_to_start') is required." }`

  - **Non-Existent Intersections**:  
    `{ "error": "Start or end intersection does not exist." }`

  - **Server Error**:  
    `{ "error": "Failed to create road." }`

---

This API makes it easier to add roads dynamically, including support for one-way streets and their directions.

## Viewing Logs

Logs are essential for debugging and monitoring your application in Kubernetes. Here's how to view the logs of your pods and APIs:

### 1. View logs of a specific pod

To see the logs of a specific pod in Kubernetes:

1. **List all running pods**:

   ```bash
   kubectl get pods
   ```

   Example output:

   ```
   NAME                                          READY   STATUS    RESTARTS   AGE
   map-app-deployment-579b9b645d-m6bd7           1/1     Running   0          10m
   camera-app-54cff867-xpxcm                     1/1     Running   2          2d
   ```

2. **Get logs for a specific pod**:
   Replace `<pod-name>` with the name of your pod (e.g., `map-app-deployment-579b9b645d-m6bd7`):

   ```bash
   kubectl logs <pod-name>
   ```

   Example:

   ```bash
   kubectl logs map-app-deployment-579b9b645d-m6bd7
   ```

3. **Follow live logs**:
   Use the `-f` flag to follow the logs in real-time:
   ```bash
   kubectl logs -f <pod-name>
   ```

## Deploying Changes Without Downtime

To update the application while keeping the service available, you can deploy changes seamlessly using the following steps. Kubernetes ensures zero downtime by rolling out updates incrementally.

### Steps to Deploy Changes

1. **Build a New Docker Image**  
   Build a new Docker image with the updated application code. Use a unique version tag (`<version name>` in this example) to differentiate the new image from previous versions.

   ```bash
   docker build -t map-app:<version name> .
   ```

2. **Load the New Image into Minikube**  
   Minikube doesn't pull images from Docker Hub by default. You need to load the newly built image into Minikube.

   ```bash
   minikube image load map-app:<version name>
   ```

3. **Update the Kubernetes Deployment**  
   Update the Kubernetes deployment to use the new Docker image. Kubernetes will handle the rollout process by replacing the old pods with the new ones one by one.

   ```bash
   kubectl set image deployments/map-app-deployment map-app=map-app:<version name>
   ```

### How It Works

- **Rolling Updates**: Kubernetes performs a rolling update by incrementally terminating old pods and starting new ones with the updated image.
- **Zero Downtime**: The service remains available as Kubernetes ensures there are always pods serving requests during the update.
- **Version Control**: By tagging images (`<version name>`, `v1.0.1`, etc.), you can track versions and roll back to a previous image if needed.

## Map (frontend)

Users can view the map at [http://localhost/map-app](http://localhost/map-app).

## Conclusion
