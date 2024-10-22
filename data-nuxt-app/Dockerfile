# Use node 22.9.0 slim image
FROM node:22.9.0-slim
RUN apt-get update && apt-get install -y openssl
# Set the working directory inside the container
WORKDIR /src

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Run Prisma generate
RUN npx prisma generate

# Run the build step
RUN npm run build

# Expose the port the app will run on
EXPOSE 3000

# Command to run the application
CMD ["node", "./.output/server/index.mjs", "-p", "3000"]
