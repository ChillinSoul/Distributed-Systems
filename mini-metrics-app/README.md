This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

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
   helm install mycluster mysql-operator/mysql-innodbcluster --set tls.useSelfSigned=true --values mysql_credentials.yaml

6. Verify Credentials by running the following command:
   helm get manifest mycluster

7. Create a new user named Api in the MySQL cluster mycluster, and grant this user the necessary privileges to access and manipulate the database.

8. Deploy a Secret URL in Kubernetes by creating a secret URL and deploying it to your Kubernetes cluster.

9. Deployment Overview:
   At this point, you should have the following components deployed:

- MySQL Operator
- MySQL cluster
- The database schema and tables

10. Build an image of your app
`& minikube -p minikube docker-env --shell powershell | Invoke-Expression`
`docker build -t mini-metrics-image .`

11. Perform Prisma migration
- Add a db schema on kubernetes cluster with the same name that is used on local tests
- Modify your environment variable to point your kubernetes mysql cluster
- `prisma migrate deploy`

12. Run the image of your app
- kubectl apply -f deployment.yaml
- kubectl apply -f service.yaml
- kubectl apply -f ingress.yaml


(cluster for each mini-service...)