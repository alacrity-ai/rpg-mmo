# Variables
DOCKER_IMAGE_NAME = mysql-image
DOCKER_CONTAINER_NAME = mysql-container
MYSQL_ROOT_PASSWORD = rootpassword
MYSQL_DATABASE = testdb
DB_HOST = 127.0.0.1  # Use IP address to enforce TCP connection
DB_USER = root
DB_PASSWORD = rootpassword
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
	docker run -d --name $(DOCKER_CONTAINER_NAME) -e MYSQL_ROOT_PASSWORD=$(MYSQL_ROOT_PASSWORD) -e MYSQL_DATABASE=$(MYSQL_DATABASE) -p 3306:3306 -v $(VOLUME_NAME):/var/lib/mysql $(DOCKER_IMAGE_NAME)

# Stop the Docker container
stop:
	docker stop $(DOCKER_CONTAINER_NAME)

# Remove the Docker container
clean: stop
	docker rm $(DOCKER_CONTAINER_NAME)

# Rebuild the Docker image and restart the container
restart: clean build start

# Connect to the MySQL database using mysql client
connect:
	mysql -h $(DB_HOST) -P 3306 -u $(DB_USER) -p$(DB_PASSWORD) $(MYSQL_DATABASE)

.PHONY: all build start stop clean restart connect ensure-volume
