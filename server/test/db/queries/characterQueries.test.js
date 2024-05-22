// test/db/queries/CharacterQueries.test.js
const { resetDatabase } = require('../../../db/utils/dbHelpers');
const { createCharacter, getCharacterById, getCharacter, getCharactersByUser, getCharacterStats, getCharacterArea, updateCharacterStats, getCharactersByIds, addCharacterFlag, removeCharacterFlag } = require('../../../db/queries/characterQueries');
const Character = require('../../../models/Character');

describe('Character Queries', () => {
  let pool;

  beforeAll(async () => {
    pool = await resetDatabase();

    // Insert necessary user to satisfy foreign key constraints
    const sqlInsertUser = 'INSERT INTO users (username, password_hash) VALUES (?, ?)';
    const users = [
      ['user1', 'password1'],
      ['user2', 'password2']
    ];

    for (const params of users) {
      await pool.execute(sqlInsertUser, params);
    }

    // Insert necessary class templates to satisfy class constraints
    const sqlInsertClassTemplate = 'INSERT INTO class_templates (name, base_stats, stat_level_scaling, description) VALUES (?, ?, ?, ?)';
    const classTemplates = [
      ['rogue', JSON.stringify({ strength: 5, stamina: 3, intelligence: 2 }), JSON.stringify({ strength: 1.2, stamina: 1.1, intelligence: 1.0 }), 'A stealthy and agile fighter, adept at avoiding detection and striking from the shadows.'],
      ['ranger', JSON.stringify({ strength: 12, agility: 14, intelligence: 10 }), JSON.stringify({ strength: 1.3, agility: 1.4, intelligence: 1.2 }), 'A versatile and skilled archer, capable of surviving in the wilderness and striking from a distance.']
    ];

    for (const params of classTemplates) {
      await pool.execute(sqlInsertClassTemplate, params);
    }

    // Insert necessary character flag templates to satisfy flag constraints
    const sqlInsertFlagTemplate = 'INSERT INTO character_flag_templates (name, description) VALUES (?, ?)';
    const flagTemplates = [
      ['flag1', 'Test flag 1'],
      ['flag2', 'Test flag 2']
    ];

    for (const params of flagTemplates) {
      await pool.execute(sqlInsertFlagTemplate, params);
    }
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('createCharacter', () => {
    it('should create a new character', async () => {
      const userId = 1; // Assuming the first inserted user has ID 1
      const characterName = 'Thalion';
      const characterClass = 'ranger';

      const characterId = await createCharacter(userId, characterName, characterClass);
      const character = await getCharacterById(characterId);

      expect(character).toBeInstanceOf(Character);
      expect(character.name).toBe(characterName.toLowerCase());
      expect(character.characterClass).toBe(characterClass.toLowerCase());
    });

    it('should throw an error if character name already exists for the user', async () => {
      const userId = 1;
      const characterName = 'Thalion';
      const characterClass = 'ranger';

      await expect(createCharacter(userId, characterName, characterClass)).rejects.toThrow(`Character with name ${characterName.toLowerCase()} already exists for user ID: ${userId}`);
    });

    it('should throw an error if class template does not exist', async () => {
      const userId = 1;
      const characterName = 'UnknownCharacter';
      const characterClass = 'unknownclass';

      await expect(createCharacter(userId, characterName, characterClass)).rejects.toThrow(`Class template not found for class: ${characterClass.toLowerCase()}`);
    });
  });

  describe('getCharacterById', () => {
    it('should retrieve a character by ID', async () => {
      const userId = 2; // Assuming the second inserted user has ID 2
      const characterName = 'Shadow';
      const characterClass = 'rogue';

      const characterId = await createCharacter(userId, characterName, characterClass);
      const character = await getCharacterById(characterId);

      expect(character).toBeInstanceOf(Character);
      expect(character.id).toBe(characterId);
      expect(character.name).toBe(characterName.toLowerCase());
      expect(character.characterClass).toBe(characterClass.toLowerCase());
    });

    it('should return null if character ID does not exist', async () => {
      const character = await getCharacterById(9999);

      expect(character).toBeNull();
    });
  });

  describe('getCharacter', () => {
    it('should retrieve a character by user ID and name', async () => {
      const userId = 1;
      const characterName = 'Thalion';

      const character = await getCharacter(userId, characterName);

      expect(character).toBeInstanceOf(Character);
      expect(character.name).toBe(characterName.toLowerCase());
    });

    it('should return null if character does not exist for the user', async () => {
      const userId = 1;
      const characterName = 'NonExistentCharacter';

      const character = await getCharacter(userId, characterName);

      expect(character).toBeNull();
    });
  });

  describe('getCharactersByUser', () => {
    it('should retrieve all characters for a user', async () => {
      const userId = 2;

      const characters = await getCharactersByUser(userId);

      expect(characters.length).toBeGreaterThanOrEqual(1);
      expect(characters[0]).toBeInstanceOf(Character);
    });
  });

  describe('updateCharacterStats', () => {
    it('should update the current stats of a character', async () => {
      const userId = 1;
      const characterName = 'Thalion1';
      const characterClass = 'ranger';

      const characterId = await createCharacter(userId, characterName, characterClass);
      const newStats = { strength: 15, agility: 18, intelligence: 12 };

      await updateCharacterStats(characterId, newStats);
      const updatedCharacter = await getCharacterById(characterId);

      expect(updatedCharacter.currentStats).toEqual(newStats);
    });
  });

  describe('addCharacterFlag', () => {
    it('should add a flag to a character', async () => {
      const userId = 1;
      const characterName = 'Thalion2';
      const characterClass = 'ranger';

      const characterId = await createCharacter(userId, characterName, characterClass);
      const flag = 'flag1';

      await addCharacterFlag(characterId, flag);
      const updatedCharacter = await getCharacterById(characterId);

      expect(updatedCharacter.flags).toContain(1); // Assuming the first inserted flag has ID 1
    });
  });

  describe('removeCharacterFlag', () => {
    it('should remove a flag from a character', async () => {
      const userId = 1;
      const characterName = 'Thalion3';
      const characterClass = 'ranger';

      const characterId = await createCharacter(userId, characterName, characterClass);
      const flag = 'flag1';

      await addCharacterFlag(characterId, flag);
      await removeCharacterFlag(characterId, flag);
      const updatedCharacter = await getCharacterById(characterId);

      expect(updatedCharacter.flags).not.toContain(1); // Assuming the first inserted flag has ID 1
    });
  });
});
