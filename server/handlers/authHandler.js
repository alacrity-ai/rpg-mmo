// handlers/authHandler.js
const crypto = require('crypto');
const db = require('../db/database');
const { User } = require('../models/user');
const { Character } = require('../models/character');
const characterQueries = require('../db/characters/queries.ts');

function createAccount(socket, [username, password]) {
    if (typeof password !== 'string') {
        socket.emit('message', 'Invalid password format.');
        return;
    }
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    db.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hash], function(err) {
        if (err) {
            socket.emit('message', 'Username already taken or error creating an account.');
            console.error(err.message);
        } else {
            socket.emit('message', 'Account created successfully. You can now login.');
        }
    });
}

function login(socket, [username, password]) {
    if (typeof password !== 'string') {
        socket.emit('message', 'Invalid password format.');
        return;
    }
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            socket.emit('message', 'Error logging in.');
            console.error(err.message);
        } else if (!row || row.password_hash !== hash) {
            socket.emit('message', 'Invalid username or password.');
        } else {
            socket.user = new User(row.id, row.username);
            socket.emit('message', `Logged in as ${username}. Use 'character new' to create a new character or 'character login' to log in as a character.`);
        }
    });
}

function createCharacter(socket, [characterName, characterClass]) {
    if (!socket.user) {
        socket.emit('message', 'You need to be logged in to create a character.');
        return;
    }
    const userId = socket.user.id;
    characterQueries.createCharacter(userId, characterName, characterClass, (err, characterId) => {
        if (err) {
            socket.emit('message', 'Error creating character.');
            console.error(err.message);
        } else {
            socket.emit('message', `Character ${characterName} created successfully.`);
        }
    });
}

function characterLogin(socket, [characterName], defaultZone, io) {
    if (!socket.user) {
        socket.emit('message', 'You need to be logged in to log in as a character.');
        return;
    }
    const userId = socket.user.id;
    characterQueries.getCharacter(userId, characterName, (err, row) => {
        if (err) {
            socket.emit('message', 'Error logging in as character.');
            console.error(err.message);
        } else if (!row) {
            socket.emit('message', 'Character not found.');
        } else {
            socket.character = new Character(row.name, row.class, row.current_stats, socket.id, userId);
            defaultZone.addPlayer(socket.character);
            socket.join(defaultZone.name);
            socket.emit('message', `Logged in as character ${row.name}.`);
            io.to(defaultZone.name).emit('message', `${row.name} has entered ${defaultZone.name}.`);
        }
    });
}

function listCharacters(socket) {
    if (!socket.user) {
        socket.emit('message', 'You need to be logged in to list characters.');
        return;
    }
    const userId = socket.user.id;
    characterQueries.getCharactersByUser(userId, (err, rows) => {
        if (err) {
            socket.emit('message', 'Error listing characters.');
            console.error(err.message);
        } else {
            const characterNames = rows.map(row => row.name);
            socket.emit('message', `Your characters: ${characterNames.join(', ')}`);
        }
    });
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