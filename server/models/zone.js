// Deprecated
// models/zone.js
class Zone {
    constructor(name) {
        this.name = name;
        this.players = [];
    }

    addPlayer(character) {
        this.players.push(character);
        console.log(`Character added: ${character.name} (Class: ${character.classType}) with socket ID ${character.socketId}, total players now: ${this.players.length}`);
    }

    removePlayer(socketId) {
        this.players = this.players.filter(character => character.socketId !== socketId);
        console.log(`Character removed: Socket ID ${socketId}, total players now: ${this.players.length}`);
    }

    getPlayer(socketId) {
        const character = this.players.find(character => character.socketId === socketId);
        return character;
    }
}

module.exports = { Zone };
