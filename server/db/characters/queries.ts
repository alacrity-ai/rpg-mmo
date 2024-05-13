// db/characters/queries.ts
const db = require('../database');

function createCharacter(userId, characterName, characterClass, callback) {
    db.run('INSERT INTO characters (user_id, name, class, base_stats, current_stats) VALUES (?, ?, ?, ?, ?)', 
        [userId, characterName, characterClass, '{}', '{}'], function(err) {
        if (err) {
            callback(err);
        } else {
            callback(null, this.lastID);
        }
    });
}

function getCharacter(userId, characterName, callback) {
    db.get('SELECT * FROM characters WHERE user_id = ? AND name = ?', [userId, characterName], (err, row) => {
        callback(err, row);
    });
}

function getCharactersByUser(userId, callback) {
    db.all('SELECT * FROM characters WHERE user_id = ?', [userId], (err, rows) => {
        callback(err, rows);
    });
}

function updateCharacterStats(characterId, currentStats, callback) {
    db.run('UPDATE characters SET current_stats = ? WHERE character_id = ?', [currentStats, characterId], (err) => {
        callback(err);
    });
}

module.exports = { getCharactersByUser, createCharacter, getCharacter, updateCharacterStats };
