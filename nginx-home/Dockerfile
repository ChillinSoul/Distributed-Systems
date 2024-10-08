# Use node 22.9.0 slim image
FROM node:22.9.0-slim

# Set the working directory inside the container
WORKDIR /src

# Copy package files and install dependencies (use npm ci for cleaner install)
COPY package*.json ./
RUN npm ci --production

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000


CMD ["node", "./.output/server/index.mjs", "-p", "3000"]