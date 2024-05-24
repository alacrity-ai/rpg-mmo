const { enqueueTask } = require('../../services/server/taskUtils');

module.exports = (socket) => {
  socket.on('viewShopInventory', async (data, callback) => {
    enqueueTask('viewShopInventory', data, callback);
  });
};
