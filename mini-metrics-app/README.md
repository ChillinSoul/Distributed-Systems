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

## DATABASE setup

1. Database Schema

- Schema Name: db_metrics
- Tables: user, formula, result

2. Environment Variables
   Configure .env:

- Database name, username, password
- Connection name, port, and schema

3. Install MySQL Operator using Helm:

```bash
helm repo add mysql-operator https://mysql.github.io/mysql-operator/
helm repo update
helm install my-mysql-operator mysql-operator/mysql-operator --namespace mysql-operator --create-namespace
helm install mysqlcluster mysql-operator/mysql-innodbcluster --set tls.useSelfSigned=true --values mysql_credentials.yaml
```
We name it "mysqlcluster" to differentiate it against "kubernetes clusters".
The "mysql_credentials.yaml" file isn't here for security reasons, but the template follows this:
```yaml
credentials:
  root:
    user: root
    password: your-password
    host: "%"
```

4. Verify resources:

```bash
helm get manifest mysqlcluster
```

5. Create a new user named Api in the MySQL cluster mysqlcluster, and grant this user the necessary privileges to access and manipulate the database.

6. Deploy a Secret URL in Kubernetes by creating a secret URL and deploying it to your Kubernetes cluster.

```bash
kubectl create secret generic db-credentials --from-literal=url=mysql://root:your-password@localhost:6446/db_metrics
```

7. Deployment Overview:
   At this point, you should have the following components deployed:

- MySQL Operator
- MySQL cluster
- The database schema and tables

8. Perform Prisma migration

- Add a db schema on kubernetes cluster with the same name that is used on local tests
- Modify your environment variable to point your kubernetes mysql cluster

```bash
`npx prisma migrate deploy`
```

9. Build an image of your app

```bash
    `& minikube -p minikube docker-env --shell powershell | Invoke-Expression`
    `docker build -t mini-metrics-image .`
```

10. Deploy Kubernetes Resources

- minikube image load mini-metrics-image
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

## Authentication and API Endpoints

1. Authentication:

- Sign Up (POST /api/signup): Registers users with hashed passwords.
- Login (POST /api/login): Verifies credentials and starts a session.
- Logout (DELETE /api/login): Ends the user session.

2. Formula Management:

- Create Formula (POST /api/formula): Adds new formulas.
- Get Formula (GET /api/formula/{id}): Fetch formulas by ID.
- Update Formula (PUT /api/formula/{id}): Modify formulas.
- Delete Formula (DELETE /api/formula/{id}): Removes formulas.

# Setup and deployment of the Mini-Metrics Application

This is a distributed system consisting of multiple services and a database, deployed on a Kubernetes cluster using Minikube

### Step 1: Prepare the Project

1. Navigate to the project directory containing the necessary files to build and deploy the application:

```bash
cd .\Distributed-Systems\mini-metrics-app\
```

2. Build the Docker image for the mini-metrics application, which will be used for deployment in Kubernetes:

```bash
docker build -t mini-metrics-image .
```

(Note: The image name mini-metrics-image should match the one specified in the deployment.yaml file for Kubernetes to use the correct image during deployment.)

### Step 2: Install Helm (as administrator)

1. Open a terminal in administrator mode and execute the following commands:

2. Install Helm(package manage used here to install the chart for the MySQL Operator):

```bash
choco install kubernetes-helm
```
Here we use chocolatey to install helm, but there are other package managers that can install helm for you
Please refer to the [helm documentation](https://helm.sh/docs/intro/quickstart/) for more information

3. Add and update Helm repository containing MySQL Operator chart:

```bash
helm repo add mysql-operator https://mysql.github.io/mysql-operator/
helm repo update
```

### Step 3: Configure Minikube and MySQL Operator

In a standard terminal:

1. Launche local Kubernetes cluster using Minikube (if it isn't the case yet):

```bash
minikube start
```

2. Install the MySQL Operator(manages MySQL databases in Kubernetes cluster):

```bash
helm install my-mysql-operator mysql-operator/mysql-operator --namespace mysql-operator --create-namespace
```

3. Create a credentials.yaml file in the root directory:

```yaml
credentials:
   root:
      user: root
      password: //fill this with the password you choose for your DB connection
      host: "%"
```

The credentials.yaml file isn't included in the github repository for security reasons.

4. Use it to create a innodbcluster:

```bash
helm install mysqlcluster mysql-operator/mysql-innodbcluster --set tls.useSelfSigned=true --values credentials.yaml
```

You can verify config & resources created by reading the manifest:

```bash
helm get manifest mysqlcluster
```

(Note: The output shows 3 InnoDB instances in the cluster, which are replicas created by the MySQL Operator to ensure high availability.)

### Step 4: Configure MySQL Database Schema

There are multiple ways to initialize the database on the mysql cluster. Therre is one way to do so:

1. Run a mysql shell and connect to the innodbcluster with your credentials
```bash
kubectl run --rm -it myshell --image=container-registry.oracle.com/mysql/community-operator -- mysqlsh

 MySQL  SQL > \connect root@mysqlcluster
```

2. Create a new schema named "db_metrics"
```bash
 MySQL  mysqlcluster:3306 ssl  SQL > CREATE SCHEMA db_metrics;
```

3. Use prisma to deploy the database on the cluster
To do so, you must execute the command into the "prisma" folder of the mini-metrics project
And you have to modify the "DATABASE_URL" environement variable in the .env file (it's not included in the repository, so you must create one in the "mini-metrics-app" folder if it isn't the case yet)

```bash
DATABASE_URL="mysql://root:your-password@localhost:6446/db_metrics"
```

You can also access the cluster with Workbench, there is the way to do it:

1. Create a port-forward for MySQL(Locally forwards port 6446 to the MySQL service exposed in Kubernetes, allowing access to the database):

```bash
kubectl port-forward service/mysqlcluster 6446
```
We choose to redirect the secundary mysql port to the mysql-operator, to keep access to local mysql instance with the default port (3306). This way we can test our service outside kubernetes as well.

2. In MySQL Workbench:

- Create a new connection (named mini-metrics-connection, or as you like).
- Create a new schema (named mini-metrics-schema) with a user and password.

Optional: you can add a new user with lower privileges, or restrained to the new db schema only, if you don't want a root access for the web service


### Step 5: Deploy and Visualize the Application

For the mini-metrics to work well, you need to install the "camera-app" service first, so please do so before deploying mini-metrics service.

1. Apply database migrations defined in Prisma to structure the database before using it

You have to use a [mysql "port forwarding"](https://dev.mysql.com/doc/mysql-operator/en/mysql-operator-connecting-port-forwarding.html) to do so.

- Create the redirection to the mysql operator
```bash
kubectl port-forward service/mysqlcluster mysql-alternate
```
mysql-alternate port = 6446

- In a second tab, apply migration files
```bash
npx prisma migrate deploy
```

2. Create Kubernetes secret containing the MySQL connection URL for our web application:

```bash
kubectl create secret generic mini-metrics-backend-url --from-literal=backend-url=mysql://root:your-password@mysqlcluster:6446/db_metrics
```

You can view the secret with the Minikube dashboard: navigate to the Secrets section to verify the presence and contents of the mini-metrics-backend-url secret. You can also view other secrets generated by mysql-operator.

3. Load in kubernetes the mini-metrics-image build earlier locally

```bash
minikube image load mini-metrics-image
```

4. Apply Kubernetes configuration files:

```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml
```

- If the Ingress addon is disabled, enable it before applying the ingress config file:

```bash
minikube addons enable ingress
```

5. Configure a local proxy for exposing Kubernetes Ingress services externally (if you use hyperv, you don't need to place a tunnel):

```bash
minikube tunnel
```

Explanation: Creates and configures Kubernetes resources for the deployment, service, and Ingress of the mini-metrics application.

- You can launch Kubernetes dashboard to monitor resources & visualize created secret:

```bash
minikube dashboard
```

### Step 6: Update System Files

If you want to access the service from your machine, you have to modify the "hosts" file from your host machine.

1. Modify the hosts file (if necessary):

- Path in windows OS: C:\Windows\System32\drivers\etc\hosts.
- Action: Open the file as an administrator (to be able to save modifications) and add an entry to associate the domain names (here, mini-metrics.example and camera-host) with the ingress IP addresses deployed with the "ingress.yaml" files.

Example: If the IP is 192.168.49.2 for mini-metrics, add a line at the end of the hosts file with the name of the ingress host associated:

```txt
192.168.49.2 mini-metrics.example
```

This way you can access our service without writing the ip address every time, it works with the web navigator, postman (or bruno)...
Extra note: The ip address is suceptible to change if the minikube cluster is stoped or rebuilt after a "minikube delete", so you have to change your host file with the new ingress ip address accordingly

## References

To learn more about Next.js, Prisma and MySQL operator:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Prisma Documentation](https://www.prisma.io/docs) - How to use Prisma ORM.
- [MySQL Operator Docs](https://dev.mysql.com/doc/mysql-operator/en/mysql-operator-innodbcluster.html)

## Contributors

- Ghita B.
- Yann D. M.

FEEDBACK prof:
script pr calculer charge du service, augmenter les replica automatisé(pr voir que charge a diminué ? )
