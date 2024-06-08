# Makefile to control the docker-compose services

# Default value for WORKER_COUNT
WORKER_COUNT ?= 1

# Default target: build and start all services
all: up

# Build and start all services with the specified number of worker instances
up: check-env
	docker-compose up --build --scale worker=$(WORKER_COUNT)

# Stop all running services
down:
	docker-compose down

# Restart all services with the specified number of worker instances
restart: down check-env
	docker-compose up --build --scale worker=$(WORKER_COUNT)

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

# Check and copy .env files if they don't exist
check-env:
	@if [ ! -f ./server/.env ]; then echo "Copying ./server/.env.example to ./server/.env"; cp ./server/.env.example ./server/.env; fi
	@if [ ! -f ./client/.env ]; then echo "Copying ./client/.env.example to ./client/.env"; cp ./client/.env.example ./client/.env; fi

.PHONY: all up down restart logs stop clean rebuild check-env
