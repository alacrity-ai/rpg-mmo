// index.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { handleCommand, defaultZone } = require('./handlers/commandHandler');
const db = require('./db/database');
require('./db/populateTemplates');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get('/', (req, res) => {
    res.send('MUD Server is running');
});

io.on('connection', (socket) => {
    socket.on('command', (input) => {
        handleCommand(socket, input, io);
    });

    socket.on('disconnect', () => {
        if (socket.character) {
            defaultZone.removePlayer(socket.id);
            io.to(defaultZone.name).emit('message', `${socket.character.name} has left the zone.`);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
