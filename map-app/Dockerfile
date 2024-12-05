# Step 1: Use the Node.js slim image as the base image
FROM node:22.9.0-slim

# Step 2: Set the working directory
WORKDIR /src

# Step 3: Copy the package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Install OpenSSL
RUN apt-get update -y && apt-get install -y openssl

# Step 6: Copy the rest of the application files
COPY . .

# Step 7: Generate Prisma Client
RUN npx prisma generate

# Step 8: Build the application
RUN npm run build

# Step 9: Expose the application port
EXPOSE 3000

# Step 10: Start the application
CMD ["npm", "start"]