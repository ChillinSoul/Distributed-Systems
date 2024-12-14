# Kubernetes Light Traffic Monitoring - Metrics Service

## Overview

The Metrics Service is part of the Light Traffic Monitoring project. It handles traffic analysis, including:

- Counting vehicles during specified time intervals.
- Capturing license plates from a camera service.
- Calculating optimal routes using Intersection and Routes services.

## Key Features

1. Traffic Data Analysis:
   - Calculates vehicle counts.
   - Suggests optimal routes.
2. Database Integration:
   - MySQL backend for storing traffic data and formulas.
3. Dynamic Visualizations:
   - Real-time graphs of applied formulas using Chart.js.
4. User Authentication:
   - Secure session management with login/signup functionality.
5. Customizable Formulas:
   - Users can create, modify, and apply formulas for data analysis.

## Technology Stack

- Frontend: React.js, Next.js, TypeScript
- Backend: Node.js, Next.js API Routes
- Database: MySQL with Prisma ORM
- Authentication: bcrypt
- Graphs: Chart.js, react-chartjs-2
- Validation: zod and react-hook-form
- Kubernetes: Minikube, Helm, MySQL Operator

## Setup and Prerequisites

1. Install Required Tools:

- Node.js (v14+), npm (v6+), Python with venv.
- Docker and Minikube.
- MySQL database.
- Next.js (v13+).

2. Install Libraries:

```bash
npm install react-hook-form zod @hookform/resolvers zod chart.js react-chartjs-2
```

## DATABASE MySQL

1. Create the Database Schema by setting up a MySQL database schema named db_metrics

2. Create the Tables within the schema, name them user, hour, and formula.

3. Configure Environment Variables by updating the .env file with the following values:

- Database name
- Username
- Password
- Connection name
- Port
- Schema name

4. Test API Routes:
   Use Postman to test the API routes by sending a POST request to localhost:3000/api/formula to populate the database with dummy data, including a formula value and its creation date and time.

5. Set Up MySQL Credentials in Kubernetes by creating a mysql_credentials.yaml file. Apply it to the cluster during installation using the following command:

```bash
   helm install mycluster mysql-operator/mysql-innodbcluster --set tls.useSelfSigned=true --values mysql_credentials.yaml
```

6. Verify Credentials by running the following command:

```bash
helm get manifest mycluster
```

7. Create a new user named Api in the MySQL cluster mycluster, and grant this user the necessary privileges to access and manipulate the database.

8. Deploy a Secret URL in Kubernetes by creating a secret URL and deploying it to your Kubernetes cluster.

9. Deployment Overview:
   At this point, you should have the following components deployed:

- MySQL Operator
- MySQL cluster
- The database schema and tables

10. Build an image of your app

```bash
    `& minikube -p minikube docker-env --shell powershell | Invoke-Expression`
    `docker build -t mini-metrics-image .`
```

11. Perform Prisma migration

- Add a db schema on kubernetes cluster with the same name that is used on local tests
- Modify your environment variable to point your kubernetes mysql cluster

```bash
`prisma migrate deploy`
```

12. Run the image of your app

- kubectl apply -f deployment.yaml
- kubectl apply -f service.yaml
- kubectl apply -f ingress.yaml

## Frontend Setup

1. Clone the repository:

```bash
git clone https://github.com/ChillinSoul/Distributed-Systems.git/mini-metrics-app
cd mini-metrics-frontend
npm install
npm run dev
```

Navigate to http://localhost:3000.

2. Key Components:

- Login Page: User authentication with form validation.
- Signup Page: Registration with validation for username, email, and password.
- Formulas Page: Graph visualization and formula management.

# Setup and deployment of the Mini-Metrics Application

This is a distributed system consisting of multiple services and a database, deployed on a Kubernetes cluster using Minikube

## Step 1: Prepare the Project

1. Navigate to the project directory containing the necessary files to build and deploy the application:

```bash
cd .\Distributed-Systems\mini-metrics-app\
```

2. Build the Docker image for the mini-metrics application, which will be used for deployment in Kubernetes:

```bash
docker build -t mini-metrics-image .
```

(Note: The image name mini-metrics-image should match the one specified in the deployment.yaml file for Kubernetes to use the correct image during deployment.)

3. Apply database migrations defined in Prisma to structure the database before using it:

```bash
npx prisma migrate deploy
```

## Step 2: Install Helm (as administrator)

1. Open a terminal in administrator mode and execute the following commands:

2. Install Helm(package manage used here to install the chart for the MySQL Operator):

```bash
choco install kubernetes-helm
```

3. Add and update Helm repository containing MySQL Operator chart:

```bash
helm repo add mysql-operator https://mysql.github.io/mysql-operator/
helm repo update
```

## Step 3: Configure Minikube and MySQL Operator

In a standard terminal:

1. Launche local Kubernetes cluster using Minikube:

```bash
minikube start
```

2. Install the MySQL Operator(manages MySQL databases in Kubernetes cluster):

```bash
helm install my-mysql-operator mysql-operator/mysql-operator --namespace mysql-operator --create-namespace
```

3. Verifie config & resources created by MySQL Operator:

```bash
helm get manifest mycluster
```

(Note: The output shows 3 InnoDB instances in the cluster, which are replicas created by the MySQL Operator to ensure high availability.)

## Step 4: Configure MySQL Database Access

1. Create a credentials.yaml file in the root directory:

```bash
credentials:
root:
user: //fill this with the username you choose for your DB connection
password: //fill this with the password you choose for your DB connection
host: "%"
```

2. Create a secret.yaml file in the root directory:

```bash
DATABASE_URL="mysql://user:password@localhost:6446/mini-metrics-schema"
```

3. In MySQL Workbench:

- Create a new connection (named mini-metrics-connection).
- Create a new schema (named mini-metrics-schema) with a user and password.
- Configure the port as 6446 instead of the default 3306.

4. Create a port-forward for MySQL(Locally forwards port 6446 to the MySQL service exposed in Kubernetes, allowing access to the database):

```bash
kubectl port-forward service/mycluster 6446
```

5. Create Kubernetes secret containing MySQL connection URL for backend application:

```bash
kubectl create secret generic mini-metrics-backend-url --from-literal=backend-url=mysql://root:password@localhost:6446/mini-metrics-schema
```

## Step 5: Deploy and Visualize the Application

1. Launch Kubernetes dashboard to monitor resources & visualize created secret:

```bash
minikube dashboard
```

2. View the secret:
   Action: In the Minikube dashboard, navigate to the Secrets section to verify the presence and contents of the mini-metrics-backend-url secret.

3. Apply Kubernetes configuration files:

```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml
minikube image load mini-metrics-image
minikube addons list
```

- If the Ingress addon is disabled, enable it:

```bash
minikube addons enable ingress
```

- Configure a local proxy for exposing Kubernetes Ingress services externally:

```bash
minikube tunnel
```

Explanation: Creates and configures Kubernetes resources for the deployment, service, and Ingress of the mini-metrics application.

## Step 6: Update System Files

1. Modify the hosts file (if necessary):

- Path: C:\Windows\System32\drivers\etc\hosts.
- Action: Open the file as an administrator and add an entry to associate a domain name (e.g., mini-metrics.example) with the Minikube IP address.
  (The Minikube IP can be found using the command below):

```bash
minikube ip
```

(Example: If the IP is 192.168.49.2, update the hosts file accordingly.)

## References

To learn more about Next.js and MySQL operator:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- https://dev.mysql.com/doc/mysql-operator/en/mysql-operator-innodbcluster.html

## Contributors

- Ghita B.
- Yann D. M.

FEEDBACK prof:
script pr calculer charge du service, augmenter les replica automatisé(pr voir que charge a diminué ? )
