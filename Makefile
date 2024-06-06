# Makefile to control the docker-compose services

# Default target: build and start all services
all: up

# Build and start all services
up:
	docker-compose up --build

# Stop all running services
down:
	docker-compose down

# Restart all services
restart: down up

# Tail logs for all services
logs:
	docker-compose logs -f

# Stop all services
stop:
	docker-compose stop

# Remove all containers
clean:
	docker-compose down --rmi all -v

# Rebuild all images without using the cache
rebuild:
	docker-compose build --no-cache

.PHONY: all up down restart logs stop clean rebuild
