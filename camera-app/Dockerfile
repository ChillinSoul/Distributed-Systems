# syntax=docker/dockerfile:1

FROM node:18-alpine

WORKDIR /app

#Copy package to the container
COPY package*.json ./

#Install dependencies
RUN npm install

COPY . .

# Run the build step
RUN npm run build

EXPOSE 3000

ENV NODE_ENV production

CMD ["npm", "start"]