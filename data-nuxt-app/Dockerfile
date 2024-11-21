FROM node:22.9.0-slim

# Install required packages
RUN apt-get update && apt-get install -y \
    openssl \
    netcat-openbsd \
    default-mysql-client \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /src

# Copy package files and prisma
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Create required directories
RUN mkdir -p /src/data/json /mnt/data

# Build the application
RUN npm run build

# Copy the entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose the port
EXPOSE 3000

# Environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Use the entrypoint script

# ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "start"]