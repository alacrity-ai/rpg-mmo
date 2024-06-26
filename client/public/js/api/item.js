import socketManager from '../SocketManager';

const viewShopInventory = (shopId) => {
  return new Promise((resolve, reject) => {
    socketManager.socket.emit('viewShopInventory', { shopId }, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

const buyItem = (shopId, itemId) => {
  return new Promise((resolve, reject) => {
    socketManager.socket.emit('buyItem', { shopId, itemId }, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
};

export default {
  viewShopInventory,
  buyItem,
};
