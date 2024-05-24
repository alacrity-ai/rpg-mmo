const crypto = require('crypto');
const { createUser, getUserByUsername } = require('../../db/queries/usersQueries');

module.exports = (socket) => {
  socket.on('createAccount', async (data, callback) => {
    const { username, password } = data;
    if (typeof password !== 'string') {
      callback({ error: 'Invalid password format.' });
      return;
    }

    const hash = crypto.createHash('sha256').update(password).digest('hex');

    try {
      const user = await createUser(username, hash);
      callback({ success: true, data: user });
    } catch (error) {
      callback({ error: 'Failed to create account. ' + error.message });
    }
  });

  socket.on('login', async (data, callback) => {
    const { username, password } = data;
    const hash = crypto.createHash('sha256').update(password).digest('hex');

    try {
      const user = await getUserByUsername(username);
      if (user && user.passwordHash === hash) {
        socket.user = { id: user.id }; // Attach user ID to the socket object
        callback({ success: true, data: user });
      } else {
        callback({ error: 'Invalid username or password.' });
      }
    } catch (error) {
      callback({ error: 'Login failed. ' + error.message });
    }
  });
};
