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
        // In programming, a .bind is used to bind a function to a specific context.
        // To elaborate, the bind() method creates a new function that, when called, has its this keyword set to the provided value.
        // Explained in layman's terms it's like saying "when this function is called, make sure that 'this' refers to this object".
        // In this case the functino being called is handleCompletedBattlerAction and the object that 'this' refers to is this.
        // In js, cloneDeep is a function that creates a deep copy of the object passed to it.
    }

    cleanup() {
        SocketManager.getSocket().off('completedBattlerAction', this.handleCompletedBattlerAction.bind(this));
    }
}
