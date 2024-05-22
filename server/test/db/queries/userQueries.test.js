// test/db/queries/User.test.js
const { resetDatabase } = require('../../../db/utils/dbHelpers');
const { createUser, getUserByUsername } = require('../../../db/queries/usersQueries');
const User = require('../../../models/User');

describe('User Queries', () => {
  let pool;

  beforeAll(async () => {
    pool = await resetDatabase();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const username = 'testuser1';
      const passwordHash = 'hashedpassword1';
      await createUser(username, passwordHash);

      const user = await getUserByUsername(username);

      expect(user).toBeInstanceOf(User);
      expect(user.username).toBe(username.toLowerCase());
      expect(user.passwordHash).toBe(passwordHash);
    });

    it('should convert username to lowercase before inserting', async () => {
      const username = 'TestUser2';
      const passwordHash = 'hashedpassword2';
      await createUser(username, passwordHash);

      const user = await getUserByUsername(username);

      expect(user).toBeInstanceOf(User);
      expect(user.username).toBe(username.toLowerCase());
    });
  });

  describe('getUserByUsername', () => {
    it('should retrieve a user by username', async () => {
      const username = 'testuser3';
      const passwordHash = 'hashedpassword3';
      await createUser(username, passwordHash);

      const user = await getUserByUsername(username);

      expect(user).toBeInstanceOf(User);
      expect(user.username).toBe(username.toLowerCase());
      expect(user.passwordHash).toBe(passwordHash);
    });

    it('should return null for a non-existent user', async () => {
      const user = await getUserByUsername('nonexistentuser');

      expect(user).toBeNull();
    });
  });
});
