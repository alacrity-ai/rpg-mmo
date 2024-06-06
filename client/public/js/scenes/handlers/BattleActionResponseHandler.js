// BattleActionResponseHandler.js

import SocketManager from "../../SocketManager.js";

export default class BattleActionResponseHandler {
    constructor(battleGrid, actionBarMenu, settings) {
        this.battleGrid = battleGrid;
        this.actionBarMenu = actionBarMenu;
        this.settings = settings;
    }

    handleCompletedBattlerAction(data) {
        try {
            if (data.actionType === 'move') {
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
            // Handle other action types as needed


        } catch (error) {
            console.error('Error handling completed battler action:', error);
        }
    }
    

    initialize() {
        SocketManager.getSocket().on('completedBattlerAction', this.handleCompletedBattlerAction.bind(this));
    }

    cleanup() {
        SocketManager.getSocket().off('completedBattlerAction', this.handleCompletedBattlerAction.bind(this));
    }
}
