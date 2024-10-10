# Step 1: Base image - Use the official Node.js image
FROM node:18-alpine AS base

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json to the container
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code to the container
COPY . .

# Step 6: Generate Prisma Client
RUN npx prisma generate

# Step 7: Build the Next.js application for production
RUN npm run build

# Step 8: Expose the port on which the application will run
EXPOSE 3000

# Step 9: Set environment variables (e.g., NODE_ENV for production mode)
ENV NODE_ENV production

# Step 10: Start the Next.js application
CMD ["npm", "start"]
