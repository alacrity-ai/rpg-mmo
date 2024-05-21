const crypto = require('crypto');
const { createUser, getUserByUsername } = require('../db/queries/usersQueries');
const { User } = require('../models/user');
const { Character } = require('../models/character');
const characterQueries = require('../db/queries/characterQueries');

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
        if (!user || user.password_hash !== hash) {
            socket.emit('message', 'Invalid username or password.');
        } else {
            socket.user = new User(user.id, user.username);
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
        const character = await characterQueries.getCharacter(userId, characterName);
        if (!character) {
            socket.emit('message', 'Character not found.');
        } else {
            socket.character = new Character(character.name, character.class, character.current_stats, socket.id, userId);
            defaultZone.addPlayer(socket.character);
            socket.join(defaultZone.name);
            socket.emit('message', `Logged in as character ${character.name}.`);
            io.to(defaultZone.name).emit('message', `${character.name} has entered ${defaultZone.name}.`);
        }
    } catch (err) {
        socket.emit('message', 'Error logging in as character.');
        console.error(err.message);
    }
}

async function listCharacters(socket) {
    if (!socket.user) {
        socket.emit('message', 'You need to be logged in to list characters.');
        return;
    }
    const userId = socket.user.id;
    try {
        const characters = await characterQueries.getCharactersByUser(userId);
        const characterNames = characters.map(row => row.name);
        socket.emit('message', `Your characters: ${characterNames.join(', ')}`);
    } catch (err) {
        socket.emit('message', 'Error listing characters.');
        console.error(err.message);
    }
}

function logout(socket, defaultZone, io) {
    if (socket.character) {
        defaultZone.removePlayer(socket.id);
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

module.exports = { createAccount, login, createCharacter, listCharacters, characterLogin, logout };
