const { query } = require('../database');

async function createUser(username, passwordHash) {
  const sql = 'INSERT INTO users (username, password_hash) VALUES (?, ?)';
  const params = [username, passwordHash];
  await query(sql, params);
}

async function getUserByUsername(username) {
  const sql = 'SELECT * FROM users WHERE username = ?';
  const params = [username];
  const rows = await query(sql, params);
  return rows[0];
}

module.exports = { createUser, getUserByUsername };
