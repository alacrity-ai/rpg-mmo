import AreaScene from "../AreaScene.js";
import SocketManager from "../../SocketManager.js";
import { fadeTransition } from "../utils/SceneTransitions.js"
import api from '../../api';

export default class BattleRoomResponseHandler {
    constructor(battleGrid, actionBarMenu, settings) {
        this.battleGrid = battleGrid;
        this.actionBarMenu = actionBarMenu;
        this.settings = settings;
    }  

    handleBattlerJoined(data) {
        try {
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

    async handleBattleCompleted(data) {
        try {
            console.log('Handling battle completed:', data);
            const { battleResult } = data;
            if (battleResult) {
                if (battleResult === 'player') {
                    const previousAreaId = this.battleGrid.scene.registry.get('previousAreaId');
                    const currentAreaId = this.battleGrid.scene.registry.get('currentAreaId');
                    // Handle battle completion
                    api.zone.requestArea(previousAreaId, currentAreaId)
                    .then((response) => {
                        const areaInstanceData = response.areaInstance;
                        const areaKey = `AreaScene_${areaInstanceData.zoneInstanceId}_${areaInstanceData.id}`;
                    
                        // Check if the scene already exists
                        if (!this.battleGrid.scene.scene.get(areaKey)) {
                            const areaScene = new AreaScene(areaKey, areaInstanceData);
                            this.battleGrid.scene.scene.add(areaKey, areaScene, false);
                        }
                    
                        fadeTransition(this.battleGrid.scene, areaKey, true);
                    })                    
                } else {
                    // Handle completed battler action
                    this.battleGrid.scene.battleActionResponseHandler.handleCompletedBattlerAction(data.actionResult);
                }
            }
        } catch (error) {
            console.error('Error handling battle completed:', error);
        }
    }

    initialize() {
        const socket = SocketManager.getSocket();
        socket.on('battleCompleted', this.handleBattleCompleted.bind(this));
        socket.on('battlerJoined', this.handleBattlerJoined.bind(this));
        socket.on('battlerLeft', this.handleBattlerLeft.bind(this));
    }

    cleanup() {
        const socket = SocketManager.getSocket();
        socket.removeAllListeners('battleCompleted');
        socket.removeAllListeners('battlerJoined');
        socket.removeAllListeners('battlerLeft');
    }
}
