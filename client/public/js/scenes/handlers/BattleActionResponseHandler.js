import SocketManager from "../../SocketManager.js";
import api from '../../api';

export default class BattleActionResponseHandler {
    constructor(battleGrid, actionBarMenu, settings) {
        this.battleGrid = battleGrid;
        this.actionBarMenu = actionBarMenu;
        this.settings = settings;
    }

    handleCompletedBattlerAction(data) {
        try {
            if (data.actionType === 'move') {
                console.log('Handling completed battler move action:', data);
                // if the data.battlerId is the same as the current player's battlerId, trigger the global cooldown
                if (data.battlerId === this.battleGrid.scene.battlerId) {
                    this.actionBarMenu.triggerGlobalCooldown(this.settings.cooldowns.short);
                    // Reset target selection
                    if (!this.battleGrid.tileFocused) {
                        this.battleGrid.clearTileSelections();
                    }
                }
    
                // Get the battler instance that moved and update its position
                const battlerInstance = this.battleGrid.getBattlerInstance(data.battlerId);
                if (battlerInstance) {
                    battlerInstance.moveToTile(data.actionData.newPosition, this.battleGrid);
                } else {
                    console.warn(`Battler instance not found for id: ${data.battlerId}`);
                }
            }
    
            if (data.actionType === 'ability') {
                console.log('Got response from ability action:', data);
                // Get the actionData, the actionType, and the user of the ability (battlerId)
                const { actionData, actionType, battlerId } = data;
                // Get the ability used (abilityTemplate), the results array, the targetBattlerIds array, and the targetTiles array
                const { abilityTemplate, results, targetBattlerIds, targetTiles } = actionData;
    
                // Log the ability used
                console.log(`Ability used: ${abilityTemplate.name}`);
    
                // Iterate through the results and update the corresponding battler instances
                results.forEach(result => {
                    const { type, amount, newMana, battlerInstance, message } = result;
    
                    // Update the battler instance in the battleGrid
                    this.battleGrid.updateBattlerInstance(battlerInstance.id, battlerInstance);
                    // Update the battler instance in the scene
                    this.battleGrid.scene.updateBattlerInstance(battlerInstance.id, battlerInstance);
                    // Update the battler's health bar
                    if (type === 'damage' ) {
                        // Update the health bar for the target battler
                        this.battleGrid.scene.battlerDisplayMenu.updateResourceBars(battlerInstance.id, battlerInstance.currentStats.health, null);
                        
                        // Run the hit animation for the target battler
                        const targetBattler = this.battleGrid.getBattlerInstance(battlerInstance.id);
                        targetBattler.playHitAnimation();
                    }
                    if (type === 'manaCost') {
                        // Update the mana bar for the user of the ability
                        const userBattler = this.battleGrid.getBattlerInstance(battlerId);
                        this.battleGrid.scene.battlerDisplayMenu.updateResourceBars(battlerId, null, newMana);
                    }
                });

                // Run the animation for the user
                const userAnimation = abilityTemplate.type === 'attack' ? 'attack' : 'cast';
                const userBattler = this.battleGrid.getBattlerInstance(battlerId);
                userBattler.playAnimationOnce(userAnimation);
    
                // If the ability was used by the current player's battler, trigger the global cooldown
                if (battlerId === this.battleGrid.scene.battlerId) {
                    const cooldownDuration = abilityTemplate.cooldownDuration;
                    const cooldownType = this.actionBarMenu.getCooldownDuration(cooldownDuration);
                    this.actionBarMenu.triggerGlobalCooldown(cooldownType);
                }
            }
        } catch (error) {
            console.error('Error handling completed battler action:', error);
        }
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
        socket.on('completedBattlerAction', this.handleCompletedBattlerAction.bind(this));
        socket.on('battlerJoined', this.handleBattlerJoined.bind(this));
        socket.on('battlerLeft', this.handleBattlerLeft.bind(this));
    }

    cleanup() {
        const socket = SocketManager.getSocket();
        socket.off('completedBattlerAction', this.handleCompletedBattlerAction.bind(this));
        socket.off('battlerJoined', this.handleBattlerJoined.bind(this));
        socket.off('battlerLeft', this.handleBattlerLeft.bind(this));
    }
}
