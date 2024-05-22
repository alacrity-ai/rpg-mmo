# Makefile for building and running the server Docker container locally for development

# Define variables
DOCKER_IMAGE_NAME = mud-server
ENV_FILE = .env

# Build the Docker image
build:
	docker build -t $(DOCKER_IMAGE_NAME) .

# Start the Docker container
start:
	docker run --env-file $(ENV_FILE) -e DB_HOST=$(shell hostname -I | awk '{print $$1}') -p 3000:3000 $(DOCKER_IMAGE_NAME)
