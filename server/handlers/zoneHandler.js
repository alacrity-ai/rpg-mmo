const { enqueueTask } = require('../db/cache/utility/taskUtils');

module.exports = (socket, io, redisClient) => {
  socket.on('requestZone', async (data, callback) => {
    if (!socket.character || !socket.character.id) {
      callback({ error: 'Character not logged in.' });
      return;
    }
    if (!socket.party || !socket.party.id) {
      callback({ error: 'Character is not in a party.' });
      return;
    }

    const { sceneKey } = data;
    const taskData = { 
      userId: socket.user.id, 
      characterId: socket.character.id, 
      partyId: socket.party.id, 
      sceneKey 
    };
    
    enqueueTask(redisClient, 'requestZone', taskData, (response) => {
      if (response.error) {
        callback({ error: response.error });
      } else {
        socket.character.zoneId = response.data.zoneInstanceId;
        callback({ data: response.data });
      }
    });
  });

  socket.on('requestArea', async (data, callback) => {
    if (!socket.character || !socket.character.id) {
      callback({ error: 'Character not logged in.' });
      return;
    }
    if (!socket.party || !socket.party.id) {
      callback({ error: 'Character is not in a party.' });
      return;
    }

    const { currentAreaId, targetAreaId } = data;
    const taskData = { 
      userId: socket.user.id, 
      characterId: socket.character.id, 
      partyId: socket.party.id, 
      currentAreaId,
      targetAreaId
    };

    enqueueTask(redisClient, 'requestArea', taskData, (response) => {
      if (response.error) {
        callback({ error: response.error });
      } else {
        callback({ data: response.data });
      }
    });
  });

  socket.on('requestTownAccess', async (data, callback) => {
    if (!socket.character || !socket.character.id) {
      callback({ error: 'Character not logged in.' });
      return;
    }

    const { sceneKey } = data;
    const taskData = { 
      userId: socket.user.id, 
      characterId: socket.character.id, 
      sceneKey
    };

    enqueueTask(redisClient, 'requestTownAccess', taskData, (response) => {
      if (response.error) {
        callback({ error: response.error });
      } else {
        callback({ data: response.data });
      }
    });
  });

  socket.on('requestWorldmap', async (data, callback) => {
    if (!socket.character || !socket.character.id) {
      callback({ error: 'Character not logged in.' });
      return;
    }

    const taskData = { 
      userId: socket.user.id, 
      characterId: socket.character.id
    };

    enqueueTask(redisClient, 'requestWorldmap', taskData, (response) => {
      if (response.error) {
        callback({ error: response.error });
      } else {
        callback({ data: response.data });
      }
    });
  });

  socket.on('requestRetreat', async (data, callback) => {
    if (!socket.character || !socket.character.id) {
      callback({ error: 'Character not logged in.' });
      return;
    }

    const taskData = { 
      userId: socket.user.id, 
      characterId: socket.character.id, 
      partyId: socket.party.id,
      zoneId: socket.character.zoneId
    };

    enqueueTask(redisClient, 'requestRetreat', taskData, (response) => {
      if (response.error) {
        callback({ error: response.error });
      } else {
        callback({ data: response.data });
      }
    });
  });
};
