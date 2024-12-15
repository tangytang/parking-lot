# Step 1: Use an official Node.js runtime as the base image
FROM node:16-alpine

# Step 2: Set the working directory inside the container
WORKDIR /

# Step 3: Install curl
RUN apk add --no-cache curl

# Step 4: Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Step 5: Install dependencies, including amqplib
RUN npm install --production && npm install amqplib

# Step 6: Copy the rest of the application source code
COPY . .

# Step 7: Expose the port the service will run on
EXPOSE 3001

# Step 8: Define environment variables (optional, can also be passed during runtime)
ENV AMQP_URL=amqp://rabbitmq

# Step 9: Command to run the service
CMD ["node", "src/app.js"]
