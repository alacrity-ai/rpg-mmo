const authHandler = require('./api/authHandler');
const messageHandler = require('./api/messageHandler');
const { Zone } = require('../models/zone');

const defaultZone = new Zone('Starting Zone');

function handleCommand(socket, input, io) {
    const [command, ...args] = input.split(' ');
    console.log(`Received command: ${command}`)
    if (!socket.user && (command !== 'login' && command !== 'create' && command !== 'help')) {
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
                case 'info':
                    const characterName = subArgs.join(' ');
                    authHandler.characterInfo(socket, characterName);
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
        case 'help':
            showHelp(socket);
            break;
        default:
            socket.emit('message', 'Unknown command.');
    }
}

function showHelp(socket) {
    const helpMessage = `
Available commands:
1. create <username> <password> - Create a new account.
2. login <username> <password> - Log in to your account.
3. character new <name> <class> - Create a new character.
4. character login <name> - Log in as an existing character.
5. character list - List all your characters.
6. character info <name> - Get information about a specific character.
7. logout - Log out of your account.
8. say <message> - Send a message as your character.
9. help - Show this help message.

Examples:
- create johnDoe myPassword
- login johnDoe myPassword
- character new Aragorn ranger
- character login Aragorn
- character list
- character info Aragorn
- logout
- say Hello everyone!
- help
`;
    socket.emit('message', helpMessage);
}

module.exports = { handleCommand, defaultZone };
