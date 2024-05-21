const crypto = require('crypto');
const { createUser, getUserByUsername } = require('../db/queries/usersQueries');
const characterQueries = require('../db/queries/characterQueries');
const User = require('../models/User');
const Character = require('../models/Character');

async function createAccount(socket, [username, password]) {
    if (typeof password !== 'string') {
        socket.emit('message', 'Invalid password format.');
        return;
    }
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    try {
        await createUser(username, hash);
        socket.emit('message', 'Account created successfully. You can now login.');
    } catch (err) {
        socket.emit('message', 'Username already taken or error creating an account.');
        console.error(err.message);
    }
}

async function login(socket, [username, password]) {
    if (typeof password !== 'string') {
        socket.emit('message', 'Invalid password format.');
        return;
    }
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    try {
        const user = await getUserByUsername(username);
        if (!user || user.passwordHash !== hash) {
            socket.emit('message', 'Invalid username or password.');
        } else {
            socket.user = new User(user);
            socket.emit('message', `Logged in as ${username}. Use 'character new' to create a new character or 'character login' to log in as a character.`);
        }
    } catch (err) {
        socket.emit('message', 'Error logging in.');
        console.error(err.message);
    }
}

async function createCharacter(socket, [characterName, characterClass]) {
    if (!socket.user) {
        socket.emit('message', 'You need to be logged in to create a character.');
        return;
    }
    const userId = socket.user.id;

    try {
        const characterId = await characterQueries.createCharacter(userId, characterName, characterClass);
        socket.emit('message', `Character ${characterName} created successfully.`);
    } catch (err) {
        socket.emit('message', 'Error creating character.');
        console.error(err.message);
    }
}

async function characterLogin(socket, [characterName], defaultZone, io) {
    if (!socket.user) {
        socket.emit('message', 'You need to be logged in to log in as a character.');
        return;
    }
    const userId = socket.user.id;
    try {
        const characterData = await characterQueries.getCharacter(userId, characterName);
        if (!characterData) {
            socket.emit('message', 'Character not found.');
        } else {
            const character = new Character(characterData);
            socket.character = character;
            defaultZone.addPlayer(character);
            socket.join(defaultZone.name);
            socket.emit('message', `Logged in as character ${character.name}.`);
            io.to(defaultZone.name).emit('message', `${character.name} has entered ${defaultZone.name}.`);
        }
    } catch (err) {
        socket.emit('message', 'Error logging in as character.');
        console.error(err.message);
    }
}

async function characterInfo(socket, characterName) {
    if (!socket.user) {
        socket.emit('message', 'You need to be logged in to view character info.');
        console.log('Character info request failed: user not logged in');
        return;
    }
    const userId = socket.user.id;
    console.log(`Fetching info for character: ${characterName} of user ID: ${userId}`);
    try {
        const character = await characterQueries.getCharacter(userId, characterName);
        if (character) {
            const characterInfo = {
                id: character.id,
                name: character.name,
                class: character.characterClass,
                baseStats: character.baseStats,
                currentStats: character.currentStats,
                currentAreaId: character.currentAreaId,
                socketId: character.socketId
            };
            console.log(`Character info requested by User ID: ${userId}`);
            socket.emit('message', `Character info: ${JSON.stringify(characterInfo)}`);
        } else {
            socket.emit('message', 'Character not found.');
            console.log(`Character not found: ${characterName} for user ID: ${userId}`);
        }
    } catch (err) {
        socket.emit('message', 'Error fetching character info.');
        console.error('Error fetching character info:', err.message, err);
    }
}

async function listCharacters(socket) {
    if (!socket.user) {
        socket.emit('message', 'You need to be logged in to list characters.');
        console.log('List characters failed: user not logged in');
        return;
    }
    const userId = socket.user.id;
    console.log(`Listing characters for user ID: ${userId}`);
    try {
        const characters = await characterQueries.getCharactersByUser(userId);
        const characterNames = characters.map(character => {
            return character.name;
        });
        console.log('Character names:', characterNames);
        socket.emit('message', `Your characters: ${characterNames.join(', ')}`);
    } catch (err) {
        socket.emit('message', 'Error listing characters.');
        console.error('Error listing characters:', err.message, err);
    }
}

function logout(socket, defaultZone, io) {
    if (socket.character) {
        defaultZone.removePlayer(socket.character.id);
        io.to(defaultZone.name).emit('message', `${socket.character.name} has left the zone.`);
        delete socket.character;
    }

    if (socket.user) {
        socket.emit('message', 'Logged out successfully.');
        delete socket.user;
    } else {
        socket.emit('message', 'You are not logged in.');
    }
}

module.exports = { characterInfo, createAccount, login, createCharacter, listCharacters, characterLogin, logout };
