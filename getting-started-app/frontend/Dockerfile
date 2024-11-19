# Use an official Node.js runtime as a base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy the package.json and install dependencies
COPY . .
RUN npm install


RUN npm run build

# Expose the port
EXPOSE 3000

# Run the application
CMD ["npm", "start"]

# Final stage for serving (if you want to serve both with NGINX, etc.)
# FROM nginx:alpine
# COPY --from=frontend /app/frontend/build /usr/share/nginx/html