# Kubernetes Light Traffic Monitoring - Metrics Service

The Metrics Service is a core component of the Light Traffic Monitoring project. It handles various calculations, including:

- Counting vehicles during specified time intervals.
- Capturing license plates from a camera service at a given time.
- Calculating the optimal route using data from the Intersection and Routes service.

## Features

- Traffic Data Analysis: Calculates metrics such as vehicle count and optimal route suggestions.
- Database Integration: MySQL backend for storing and querying traffic data and formulas.
- Dynamic Visualizations: Graphical representation of applied formulas.
- Authentication: User-based authentication and session management.
- Customizable Formulas: Build and use custom or predefined formulas for analysis.

## Prerequisites

Before starting, ensure you have the following installed:

- Node.js (v14 or higher)
- npm (v6 or higher)
- Next.js (v13 or higher)
- Python (with venv support)
- Docker and Minikube
- MySQL database

Additionally, install the required libraries:

- react-hook-form
- zod and @hookform/resolvers/zod
- chart.js and react-chartjs-2

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

We created a virtual environment with: py -m venv .venv
Link Mysql and prisma using Python: https://prisma-client-py.readthedocs.io/en/stable/

### DATABASE MySQL

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

### Frontend in Typescript

## Setup and Installation

1. Clone the repository:

```bash
   git clone https://github.com/your-repo/mini-metrics-frontend.git
   cd mini-metrics-frontend
```

2. Install dependencies:

```bash
   npm install
```

3. Run the development server:

```bash
   npm run dev
```

4. Visit the application: Open your browser and navigate to http://localhost:3000.

## Key Components

1. Login Page (src/app/Login/page.tsx)
   Handles user authentication using form validation with react-hook-form and zod.
   Redirects authenticated users to the Formulas dashboard.
2. Signup Page (src/app/Signup/page.tsx)
   Enables new user registration with validation for username, email, and password.
   Redirects successfully registered users to the Login page.
3. Formulas Page (src/app/Formulas/page.tsx)
   Allows users to build and apply formulas.
   Displays real-time graphs using chart.js based on the applied formulas.
   Provides options to add or clear formulas.

## Usage

1. Authentication:
   Navigate to the Login page.
   Use your credentials to log in or sign up for a new account.

2. Manage Formulas:
   Once authenticated, access the Formulas page.
   Create a new formula or use a predefined one.
   Apply formulas to visualize data on the graph.

3. Customization:
   Modify the formulas array in the Formulas page to add new default formulas.

## Dependencies

- react-hook-form: For form validation and handling.
- zod: Schema validation for forms.
- chart.js: For rendering dynamic graphs.
- react-chartjs-2: React wrapper for Chart.js.

## API Endpoints

### Authentication

The application provides APIs for user authentication, including sign-up, login, and logout.

#### Sign Up

Endpoint: POST /api/signup
Description: Registers a new user with a hashed password.

- Request Body:

```bash
  {
  "username": "string",
  "email": "string",
  "password": "string"
  }
```

- Response:

```bash
  Success (200):
  {
  "id": "number",
  "name": "string",
  "email": "string"
  }
```

Error (400): Returns validation errors if input is invalid.

#### Login

Endpoint: POST /api/login
Description: Logs in a user by verifying their email and password.

- Request Body:

```bash
  {
  "email": "string",
  "password": "string"
  }
```

- Response:
  Success (200): Returns user details and starts a session.
  Error (403): Returns "Wrong credentials" if login fails.
  Error (400): Returns "No user found with this email" if the email does not exist.

#### Logout

Endpoint: DELETE /api/login
Description: Ends the user's session.
Response:
Success (200): Returns "Log out done."
Error (403): Returns "You're not logged in

## Formulas

The application allows users to create, view, update, and delete mathematical formulas.

## Create Formula

Endpoint: POST /api/formula
Description: Adds a new formula to the database for the authenticated user.

- Request Body:

```bash
  {
  "formula": "string"
  }
```

- Response:

```bash
  Success (200):
  {
  "message": "Formula successfully created!",
  "formula": {
  "id": "number",
  "formula": "string",
  "authorId": "number"
  }
  }
```

Error (403): Returns "You must log in to your account to add formulas."

## Get Formula by ID

Endpoint: GET /api/formula/{id}
Description: Retrieves a formula by its ID.

- Response:

```bash
  Success (200):
  {
  "message": "Formula found!",
  "formula": {
  "id": "number",
  "formula": "string",
  "authorId": "number"
  }
  }
```

Error: Returns a 404 error if the formula does not exist.

## Update Formula

Endpoint: PUT /api/formula/{id}
Description: Updates an existing formula by its ID.

- Request Body:

```bash
  {
  "formula": "string"
  }
```

- Response:

```bash
  Success (200):
  {
  "message": "Formula successfully modified!",
  "formula": {
  "id": "number",
  "formula": "string",
  "authorId": "number"
  }
  }
```

Error: Returns a 404 error if the formula does not exist.

## Delete Formula

Endpoint: DELETE /api/formula/{id}
Description: Deletes a formula by its ID.

- Response:

```bash
  Success (200):
  {
  "message": "Formula erased!",
  "formula": {
  "id": "number",
  "formula": "string",
  "authorId": "number"
  }
  }
```

Error: Returns a 404 error if the formula does not exist.

## Validation Rules

The application uses zod schemas to validate user inputs for authentication and formula creation. Below are the rules for validation:

### Sign Up

- username: Required, non-empty string.
- email: Required, must be a valid email format.
- password: Required, minimum length 8 characters.

### Login

- email: Required, must be a valid email format.
- password: Required, non-empty string.

## Technologies Used

- Backend: Node.js, Next.js API Routes
- Database: MySQL with Prisma ORM
- Authentication: bcrypt, session management
- Frontend: React.js, TypeScript
- Graphs: Chart.js, react-chartjs-2
- Validation: zod

## References & contributions

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

FEEDBACK prof:
script pr calculer charge du service, augmenter les replica automatisé(pr voir que charge a diminué ? )

# setup and deployment of the Mini-Metrics Application

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
