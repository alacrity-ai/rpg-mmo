class User {
    constructor({ id, username, password_hash }) {
      this.id = id;
      this.username = username;
      this.passwordHash = password_hash;
    }
  }
  
  module.exports = User;
  