const { query } = require('../database');
const User = require('../../models/User');

async function createUser(username, passwordHash) {
  const sql = 'INSERT INTO users (username, password_hash) VALUES (?, ?)';
  const params = [username, passwordHash];
  await query(sql, params);
}

async function getUserByUsername(username) {
  const sql = 'SELECT * FROM users WHERE username = ?';
  const params = [username];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    return new User(rows[0]);
  }
  return null;
}

module.exports = { createUser, getUserByUsername };
