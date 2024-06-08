# Mists of Aldera
### A Massively Mutliplayer Roleplaying Game

![MMO Project Image](project.png)

## Overview

This project is an MMO (Massively Multiplayer Online) game that combines a graphical client, a server to handle client connections, workers to handle game logic, and a database for storing game data. The game features a transition from a text-based to a graphical interface, utilizing a 32-bit pixel art style. It includes multiple scenes such as towns, expeditions, and combat encounters.

## Quickstart

1. Clone the repository
2. Navigate to the repository folder you just cloned
3. Rename .env.example to .env and adjust as necessary (It will work out of the box for dev testing)
4. Start the all services with docker-compose, with command: `make up`

NOTE: Docker must be installed

## Repository Structure

- **client**: Contains the graphical interface for the game.
- **server**: Manages game client connections, enqueues tasks for the workers
- **workers**: Receives tasks from redis, performs business logic and database interactions, publishes results
- **redis**: Stores tasks, and task results.  Tasks are handled by worker, results are passed to clients from server.
- **database**: MySQL 8.0 Database responsible for maintaining game state, user accounts, etc

## High-Level Description

### Client

The client is responsible for rendering the game's graphical interface. It handles user interactions, displays various game scenes (towns, expeditions, combat encounters), and communicates with the server for real-time updates.

### Server

The server manages game logic and communication between clients. It handles authentication, command processing, message handling, and database interactions. The server ensures the game state is synchronized across all clients.  The server puts tasks in the Redis cache for Workers to perform, this allows for infinite scalability of service processes.

### Worker

The worker handles tasks which appear in the Redis cache.  Any number of workers can be instantiated to allow for elastic scaling of the backend tasks.

### Database

The database stores all game data, including player information, NPCs, items, and more. It uses Docker for easy setup and management. Initial data population scripts are provided to populate the database with necessary data.

### Redis Cache

The redis cache is used by the server to queue tasks, which are then picked up by the workers.

## Conclusion

This project combines a graphical client, server, and database to create a fully functional MMO game. Follow the instructions above to set up the database, run the server, and at least one worker, bootup the redis service, and start the client to begin development or testing.

## Developer Guide

### Env file

1. Rename .env.example to .env
2. For local dev testing, the .env.example values will work out of the box

### Instantiating the Database for Testing

1. Navigate to the `database` folder: `cd database`
2. Build the Docker container:
    
    `make build`
3. Start the Database:

    `make start`
    
3. (Optional) Connect to the database (`mysql` client must be installed):
    
    `make connect`
    

**Note**: Ensure you have Docker installed on your system.

### Starting the Redis service

1. Navigate to the `redis` folder: `cd redis`
2. Build the Docker container:
    
    `make build`
    
3. Start the redis service:
    
    `make start`
    

**Note**: Ensure you have Docker installed on your system.

### Running the worker service

At least one instance of the worker service must be running in order for any backend jobs to get done.

1. Navigate to the 'server' folder:

   `cd server`

2. Install the necessary dependencies:

   `npm install`

3. Start the worker.

   `npm run worker` or for docker, `make start-worker`

### Running the Server

1. Navigate to the `server` folder:
    
    `cd server`
    
2. Install the necessary dependencies:
    
    `npm install` or for docker `make build`
    
3. Ensure you have a `.env` file in the `server` directory with the following content:
    
```
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=testdb
```
    
4. Start the server:
    
    `npm start` or for docker `make start`

### Running the Client

1. Navigate to the `client` folder:
    
    `cd client`
    
2. Install the necessary dependencies:
    
    `npm install` or for docker `make build`
    
3. Ensure you have a `.env` file in the `client` directory with the following content:
    
    `VITE_SERVER_URL=http://localhost:3000`
    
4. Start the client:
    
    `npm start` or for docker `make start`
    
    This should open the client in your browser window. Make sure the server is running before starting the client.

