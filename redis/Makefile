# Variables
DOCKER_IMAGE_NAME = redis-image
DOCKER_CONTAINER_NAME = redis-container
VOLUME_NAME = $(shell pwd)/volume

# Default target
all: build start

# Ensure the volume directory exists
ensure-volume:
	mkdir -p $(VOLUME_NAME)

# Build the Docker image
build:
	docker build -t $(DOCKER_IMAGE_NAME) .

# Run the Docker container with volume mounting
start: ensure-volume
	docker run -d --name $(DOCKER_CONTAINER_NAME) -p 6379:6379 -v $(VOLUME_NAME):/data $(DOCKER_IMAGE_NAME)

# Stop the Docker container
stop:
	docker stop $(DOCKER_CONTAINER_NAME)

# Remove the Docker container
clean: stop
	docker rm $(DOCKER_CONTAINER_NAME)

# Rebuild the Docker image and restart the container
restart: clean build start

# Connect to the Redis instance using redis-cli
connect:
	docker exec -it $(DOCKER_CONTAINER_NAME) redis-cli

.PHONY: all build start stop clean restart connect ensure-volume
