// db/queries/usersQueries.js
const { query } = require('../database');
const User = require('../../models/User');

async function createUser(username, passwordHash) {
  // Convert username to lowercase
  const lowerCaseUsername = username.toLowerCase();
  const insertSql = 'INSERT INTO users (username, password_hash) VALUES (?, ?)';
  const insertParams = [lowerCaseUsername, passwordHash];
  const result = await query(insertSql, insertParams);

  // Check if insert was successful
  if (result.affectedRows > 0) {
    const selectSql = 'SELECT * FROM users WHERE id = ?';
    const selectParams = [result.insertId];
    const rows = await query(selectSql, selectParams);
    if (rows.length > 0) {
      return new User(rows[0]);
    }
  }

  return null;
}

async function getUserByUsername(username) {
  // Convert username to lowercase
  const lowerCaseUsername = username.toLowerCase();
  const sql = 'SELECT * FROM users WHERE username = ?';
  const params = [lowerCaseUsername];
  const rows = await query(sql, params);
  if (rows.length > 0) {
    return new User(rows[0]);
  }
  return null;
}

module.exports = { createUser, getUserByUsername };
