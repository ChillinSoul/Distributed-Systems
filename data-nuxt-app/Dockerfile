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

# Create data directory
RUN mkdir -p /src/data/json

# Expose the port the app will run on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
