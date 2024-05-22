// test/models/User.test.js

const User = require('../../models/User');

describe('User', () => {
  it('should create an instance of User with correct properties', () => {
    const user = new User({
      id: 1,
      username: 'testuser',
      password_hash: 'hashedpassword'
    });

    expect(user.id).toBe(1);
    expect(user.username).toBe('testuser');
    expect(user.passwordHash).toBe('hashedpassword');
  });

  it('should handle different usernames correctly', () => {
    const user = new User({
      id: 2,
      username: 'anotheruser',
      password_hash: 'anotherhashedpassword'
    });

    expect(user.id).toBe(2);
    expect(user.username).toBe('anotheruser');
    expect(user.passwordHash).toBe('anotherhashedpassword');
  });

  it('should handle empty username correctly', () => {
    const user = new User({
      id: 3,
      username: '',
      password_hash: 'emptyuserpassword'
    });

    expect(user.id).toBe(3);
    expect(user.username).toBe('');
    expect(user.passwordHash).toBe('emptyuserpassword');
  });
});
