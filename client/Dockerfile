# Use the official Node.js image as the base image
FROM node:20

# Set the working directory
WORKDIR /app

# Build argument to control npm log level
ARG NPM_CONFIG_LOGLEVEL=info
ENV NPM_CONFIG_LOGLEVEL=${NPM_CONFIG_LOGLEVEL}

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --verbose

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Define environment variable for production
ENV NODE_ENV=production

# Build the app
RUN npm run build

# Start the app using the startup script
CMD ["npm", "start"]
