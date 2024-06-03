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
                this.actionBarMenu.triggerGlobalCooldown(this.settings.cooldowns.short);
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
