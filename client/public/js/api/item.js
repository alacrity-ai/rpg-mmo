import api from '../api';

api.item.getItemDetails(itemId).then(itemDetails => {
  console.log('Item details:', itemDetails);
  // Update the UI with the item details
}).catch(error => {
  console.error('Error fetching item details:', error);
});
