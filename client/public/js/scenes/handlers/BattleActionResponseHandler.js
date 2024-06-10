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
            // Handle other action types as needed

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
                this.battleGrid.addBattler(newBattlerInstance, newBattlerInstance.gridPosition, false);
            } else {
                console.warn(`Battler instance data not found for id: ${data.battlerId}`);
            }

        } catch (error) {
            console.error('Error handling battler joined:', error);
        }
    }

    initialize() {
        const socket = SocketManager.getSocket();
        socket.on('completedBattlerAction', this.handleCompletedBattlerAction.bind(this));
        socket.on('battlerJoined', this.handleBattlerJoined.bind(this));
    }

    cleanup() {
        const socket = SocketManager.getSocket();
        socket.off('completedBattlerAction', this.handleCompletedBattlerAction.bind(this));
        socket.off('battlerJoined', this.handleBattlerJoined.bind(this));
    }
}
