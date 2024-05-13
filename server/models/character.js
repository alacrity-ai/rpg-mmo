// models/character.js
class Character {
  constructor(name, classType, currentStats, socketId, userId) {
      this.name = name;
      this.classType = classType;
      this.currentStats = currentStats;
      this.socketId = socketId;
      this.userId = userId;
  }
}

module.exports = { Character };
