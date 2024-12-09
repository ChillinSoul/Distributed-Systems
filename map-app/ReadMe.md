# Map Application

By Thibaut François & Jordan Hermans

## Introduction

The **Map Application** is a part of the **Brussels Traffic Monitoring** project, focusing on analyzing traffic in Brussels for improved mobility and sustainable development. This application allows users to visualize the map, view all roads and intersections, access the quickest paths between locations, delete roads and signal that a road is not usable.

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

   or if you are on windows run:

   ```bash
   cd ./nginx-home/
   docker build -t nginx-home-image .
   minikube image load nginx-home-image
   kubectl apply -f deployment.yaml
   kubectl apply -f service.yaml
   cd ..
   cd ./data-nuxt-app/
   docker build -t data-nuxt-app-image .
   minikube image load data-nuxt-app-image
   kubectl apply -f deployment.yaml
   kubectl apply -f service.yaml
   kubectl apply -f ./ingress.yaml
   cd ..
   cd ./camera-app/
   docker build -t camera-app-image .
   minikube image load camera-app-image
   kubectl apply -f deployment.yaml
   kubectl apply -f service.yaml
   cd ..
   cd ./map-app/
   docker build -t map-app .
   minikube image load map-app
   kubectl apply -f deployment.yaml
   kubectl apply -f service.yaml
   minikube addons enable ingress
   ```

4. **Create the Database**;

   Paste the following bash command in the terminal:

   ```bash
   kubectl apply -f crds.yaml
   kubectl apply -f operator.yaml
   ```

   Wait few seconds so that the operator pod is up and running and then paste the following bash command:

   ```bash
   kubectl apply -f example.yaml
   kubectl apply -f client-insecure-operator.yaml
   kubectl exec -it cockroachdb-client-insecure -- ./cockroach sql --certs-dir=/cockroach/cockroach-certs --insecure --host=cockroachdb-public
   ```

   Then an sql terminal opens. Paste the following sql commands in it:

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
      id INT PRIMARY KEY,
      start_intersection INT NOT NULL,
      end_intersection INT NOT NULL,
      length INT NOT NULL,
      FOREIGN KEY (start_intersection) REFERENCES intersections(id),
      FOREIGN KEY (end_intersection) REFERENCES intersections(id)
   );

   INSERT INTO intersections (id, name, x_coordinate, y_coordinate) VALUES
   (1, 'A', 250, 400),
   (2, 'B', 350, 400),
   (3, 'C', 450, 400),
   (4, 'D', 550, 400),
   (5, 'E', 150, 300),
   (6, 'F', 250, 300),
   (7, 'G', 350, 300),
   (8, 'H', 450, 300),
   (9, 'I', 550, 300),
   (10, 'J', 150, 200),
   (11, 'K', 250, 200),
   (12, 'L', 350, 200),
   (13, 'M', 450, 200),
   (14, 'N', 550, 200),
   (15, 'O', 250, 100),
   (16, 'P', 350, 100),
   (17, 'Q', 450, 100),
   (18, 'R', 100, 400),
   (19, 'S', 100, 500),
   (20, 'T', 250, 500),
   (21, 'U', 550, 500),
   (22, 'V', 650, 400),
   (23, 'W', 650, 300),
   (24, 'X', 650, 200),
   (25, 'Y', 550, 100);

   INSERT INTO roads (id, start_intersection, end_intersection, length) VALUES
   (1, 1, 2, 100),
   (2, 2, 3, 100),
   (3, 3, 4, 100),
   (4, 1, 6, 100),
   (5, 6, 7, 100),
   (6, 7, 8, 100),
   (7, 8, 9, 100),
   (8, 5, 10, 100),
   (9, 10, 11, 100),
   (10, 11, 12, 100),
   (11, 12, 13, 100),
   (12, 13, 14, 100),
   (13, 11, 15, 100),
   (14, 15, 16, 100),
   (15, 16, 17, 100),
   (16, 17, 13, 100),
   (17, 6, 12, 100),
   (18, 3, 7, 100),
   (19, 18, 5, 100),
   (20, 18, 19, 100),
   (21, 19, 20, 150),
   (22, 20, 1, 100),
   (23, 4, 21, 150),
   (24, 21, 22, 150),
   (25, 22, 23, 100),
   (26, 23, 9, 100),
   (27, 23, 24, 100),
   (28, 24, 14, 100),
   (29, 14, 25, 100),
   (30, 25, 17, 100);

   ALTER TABLE roads ADD COLUMN Useable BOOLEAN DEFAULT TRUE;

   \q
   ```

5. **Start the Minikube Tunnel**:

   This command will expose your services:

   ```bash
   minikube tunnel
   ```

6. **Cleanup**:

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

## API Access

### Access to the Map Data

Access map data via the API at [http://localhost/map-app/api/map-data](http://localhost/map-app/api/map-data). The datas are send on a json format with first a list of all the intersections and second a list of all the roads.

- **Intersections** have an id, a name and (x,y) localisation coordinates
- **Roads** have an id, the intersection id where the road start, the intersection id were the road end, the length of the road and a boolean value that indicates if the road is useable or not.

```json
{
  "intersections": [
    {
      "id": 1,
      "name": "A",
      "x_coordinate": 250,
      "y_coordinate": 400
    },
    ...
    {
      "id": 25,
      "name": "Y",
      "x_coordinate": 550,
      "y_coordinate": 100
    }
  ],
  "roads": [
    {
      "id": 1,
      "start_intersection": 1,
      "end_intersection": 2,
      "length": 100,
      "useable": true
    },
    ...
    {
      "id": 30,
      "start_intersection": 25,
      "end_intersection": 17,
      "length": 100,
      "useable": true
    }
  ]
}

```

You can access to the api in the terminal with :

```bash
curl -X GET http://localhost/map-app/api/map-data
```

## Find the road path between 2 points

You can calculate the fastest path between 2 intersections by reaching the calculate-route API. Specify the id of the start and end intersections in the path to obtain the shortest road.

```url
http://localhost/map-app/api/shortest-path?start=16&end=21
```

The API respond with all the intersections to pass through to go from one intersection to another. Here to go from intersection 16 to intersection 21, you have to pass through the intersections 16, 17, 13, 14, 24, 23, 22, 21.

```json
[
  {
    "id": 16,
    "name": "P",
    "x_coordinate": 350,
    "y_coordinate": 100
  },
  {
    "id": 17,
    "name": "Q",
    "x_coordinate": 450,
    "y_coordinate": 100
  },
  ...
  {
    "id": 21,
    "name": "U",
    "x_coordinate": 550,
    "y_coordinate": 500
  }
]
```

You can access to the api in the terminal with

```bash
curl -X GET "http://localhost/map-app/api/shortest-path?start=16&end=21"
```

### Change the useability of the road in case of roadwork

The roads have a useable status tha indicate if the road can be used or if this road is not accessible. The "usable" attributes is a boolean. true indicates that the road can be used and false that the road is not accessible.

`"useable": true`

You can change the usability of the road by reaching

## Interactive Map (frontend)

Users can view the map at [http://localhost/map-app](http://localhost/map-app).

## Conclusion

The Map Application serves as a crucial component in the broader **Brussels Traffic Monitoring** project, utilizing modern technologies like Kubernetes and Docker for deployment. By following the provided instructions, you can deploy and run the application locally and access the map and its API.
