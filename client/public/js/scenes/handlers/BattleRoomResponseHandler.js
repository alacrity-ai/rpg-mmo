import SocketManager from "../../SocketManager.js";
import api from '../../api';

export default class BattleRoomResponseHandler {
    constructor(battleGrid, actionBarMenu, settings) {
        this.battleGrid = battleGrid;
        this.actionBarMenu = actionBarMenu;
        this.settings = settings;
    }  

    handleBattlerJoined(data) {
        try {
            console.log('Handling battler joined:', data);

            // Update scene data
            this.battleGrid.scene.battlerInstancesData = data.battlerInstancesData;
            this.battleGrid.scene.battleInstanceData = data.battleInstanceData;

            // Add the new battler to the battle grid
            const newBattlerInstance = data.battlerInstancesData.find(b => b.id === data.battlerId);
            if (newBattlerInstance) {
                this.battleGrid.addBattler(newBattlerInstance, newBattlerInstance.gridPosition, false, 1);
            }

            // Update the battlerDisplayMenu
            this.battleGrid.scene.battlerDisplayMenu.updateBattlers(data.battlerInstancesData);
        } catch (error) {
            console.error('Error handling battler joined:', error);
        }
    }

    async handleBattlerLeft(data) {
        try {
          console.log('Handling battler left:', data);
    
          // Update battleGrid data
          this.battleGrid.scene.battlerInstancesData = data.battlerInstancesData;
          this.battleGrid.scene.battleInstanceData = data.battleInstanceData;
    
          // Remove each battler from the battle grid
          data.battlerIds.forEach(battlerId => {
            this.battleGrid.removeBattler(battlerId);
          });

          // Update the battlerDisplayMenu
          const battlerInstances = await api.battler.getBattlers(this.battleGrid.scene.battleInstanceId);
          this.battleGrid.scene.battlerDisplayMenu.updateBattlers(battlerInstances);
        } catch (error) {
          console.error('Error handling battler left:', error);
        }
    }

    initialize() {
        const socket = SocketManager.getSocket();
        socket.on('battlerJoined', this.handleBattlerJoined.bind(this));
        socket.on('battlerLeft', this.handleBattlerLeft.bind(this));
    }

    cleanup() {
        const socket = SocketManager.getSocket();
        socket.off('battlerJoined', this.handleBattlerJoined.bind(this));
        socket.off('battlerLeft', this.handleBattlerLeft.bind(this));
    }
}
