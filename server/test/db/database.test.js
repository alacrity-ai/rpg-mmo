// test/database.test.js
const { resetDatabase } = require('../../db/utils/dbHelpers');
const { query } = require('../../db/database');

describe('Database Module', () => {
  let pool;

  beforeAll(async () => {
    pool = await resetDatabase();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('query', () => {
    it('should insert and retrieve a user', async () => {
      const sqlInsert = 'INSERT INTO users (username, password_hash) VALUES (?, ?)';
      const paramsInsert = ['testuser', 'hashedpassword'];
      await query(sqlInsert, paramsInsert);

      const sqlSelect = 'SELECT * FROM users WHERE username = ?';
      const paramsSelect = ['testuser'];
      const results = await query(sqlSelect, paramsSelect);

      expect(results.length).toBe(1);
      expect(results[0].username).toBe('testuser');
      expect(results[0].password_hash).toBe('hashedpassword');
    });

    it('should handle a failed query gracefully', async () => {
      const sql = 'SELECT * FROM non_existent_table';
      await expect(query(sql)).rejects.toThrow();
    });
  });
});
