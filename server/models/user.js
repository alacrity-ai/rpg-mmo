/**
 * Class representing a user.
 */
class User {
    /**
     * Create a user.
     * @param {Object} params - The parameters for creating a user.
     * @param {number} params.id - The ID of the user.
     * @param {string} params.username - The username of the user.
     * @param {string} params.passwordHash - The hashed password of the user.
     */
    constructor({ id, username, password_hash }) {
      this.id = id;
      this.username = username;
      this.passwordHash = password_hash;
    }
  }
  
module.exports = User;

/**
 * Example usage:
 * 
 * const user = new User({
 *   id: 1,
 *   username: 'exampleUser',
 *   password_hash: 'hashedPassword123'
 * });
 * 
 * console.log(user);
 * // User {
 * //   id: 1,
 * //   username: 'exampleUser',
 * //   passwordHash: 'hashedPassword123'
 * // }
 */
