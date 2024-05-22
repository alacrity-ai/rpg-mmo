# Define variables
IMAGE_NAME = rpg-mmo-gui-client
CONTAINER_NAME = rpg-mmo-gui-client-container
PORT = 8000

# Build the Docker image
build:
	docker build -t $(IMAGE_NAME) .

# Run the Docker container
run: stop
	docker run -d -p $(PORT):$(PORT) $(IMAGE_NAME)

# Clean up Docker images
clean:
	-docker rmi $(IMAGE_NAME)

# Rebuild the Docker image and run the container
rebuild: clean build run

# Tail logs of the running container
logs:
	docker logs -f $(CONTAINER_NAME)

# Build the Docker image with npm debug logs enabled
debug-build:
	docker build --build-arg NPM_CONFIG_LOGLEVEL=verbose -t $(IMAGE_NAME) .

.PHONY: build run stop clean rebuild logs debug-build
