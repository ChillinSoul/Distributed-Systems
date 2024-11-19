

# FROM node:18-alpine
# WORKDIR /app
# COPY . .
# RUN yarn install --production
# CMD ["node", "src/index.js"]
# EXPOSE 3000

# # Use an official Python runtime as a parent image
# FROM python:3.8-slim

# # Set the working directory in the container
# WORKDIR /app

# # Copy the current directory contents into the container at /app
# COPY . /app

# # Install the Flask dependencies
# RUN pip install flask

# # Make port 5000 available to the world outside this container
# EXPOSE 5000

# # Define environment variable
# ENV NAME World

# # Run the app
# CMD ["python", "app.py"]

# Use an official Python runtime as a parent image
FROM python:3.8-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . .

# Install Flask dependencies
RUN pip install flask

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Run the app
CMD ["python", "app.py"]
