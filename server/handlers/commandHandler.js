// handlers/commandHandler.js
const authHandler = require('./authHandler');
const messageHandler = require('./messageHandler');
const { Zone } = require('../models/zone');

const defaultZone = new Zone('Starting Zone');

function handleCommand(socket, input, io) {
    const [command, ...args] = input.split(' ');

    if (!socket.user && command !== 'login' && command !== 'create') {
        socket.emit('message', 'You need to be logged in to use this command.');
        return;
    }

    if (socket.user && (command === 'create' || command === 'login')) {
        socket.emit('message', 'You are already logged in. Log out first to use this command.');
        return;
    }

    switch (command) {
        case 'create':
            authHandler.createAccount(socket, args);
            break;
        case 'login':
            authHandler.login(socket, args);
            break;
        case 'character':
            const [subcommand, ...subArgs] = args;
            switch (subcommand) {
                case 'new':
                    authHandler.createCharacter(socket, subArgs);
                    break;
                case 'login':
                    authHandler.characterLogin(socket, subArgs, defaultZone, io);
                    break;
                case 'list':
                    authHandler.listCharacters(socket);
                    break;
                default:
                    socket.emit('message', 'Unknown character subcommand.');
            }
            break;
        case 'logout':
            authHandler.logout(socket, defaultZone, io);
            break;
        case 'say':
            if (socket.character) {
                messageHandler.handleMessage(io, socket, `${socket.character.name} says: "${args.join(' ')}"`, defaultZone);
            }
            break;
        default:
            socket.emit('message', 'Unknown command.');
    }
}

module.exports = { handleCommand, defaultZone };
