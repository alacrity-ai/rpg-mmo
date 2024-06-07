# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Build argument to control npm log level
ARG NPM_CONFIG_LOGLEVEL=info
ENV NPM_CONFIG_LOGLEVEL=${NPM_CONFIG_LOGLEVEL}

# Copy package.json and package-lock.json (if available)
COPY package.json ./

# Install dependencies
RUN npm install --verbose

# Copy the rest of the application code
COPY . .

# Copy the startup script
COPY start-client.sh ./

# Make the script executable
RUN chmod +x start-client.sh

# Expose the port the app runs on
EXPOSE 8000

# Define environment variable for production
ENV NODE_ENV=production

# Build the app
RUN npm run build

# Start the app using the startup script
CMD ["npm", "start"]
