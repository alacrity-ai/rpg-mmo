// api/shop.js
import socketManager from '../SocketManager';

const viewShopInventory = (shopId) => {
  return new Promise((resolve, reject) => {
    socketManager.getSocket().emit('viewShopInventory', { shopId }, (response) => {
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
};
