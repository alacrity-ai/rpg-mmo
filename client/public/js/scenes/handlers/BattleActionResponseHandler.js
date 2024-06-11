import SocketManager from "../../SocketManager.js";
import api from '../../api';
import SoundFXManager from '../../audio/SoundFXManager.js';

export default class BattleActionResponseHandler {
    constructor(battleGrid, actionBarMenu, settings) {
        this.battleGrid = battleGrid;
        this.actionBarMenu = actionBarMenu;
        this.settings = settings;
    }

    handleCompletedBattlerAction(data) {
        try {
            if (data.actionType === 'move') {
                this.handleMoveAction(data);
            } else if (data.actionType === 'ability') {
                this.handleAbilityAction(data);
            }
        } catch (error) {
            console.error('Error handling completed battler action:', error);
        }
    }

    handleMoveAction(data) {
        console.log('Handling completed battler move action:', data);
        // if the data.battlerId is the same as the current player's battlerId, trigger the global cooldown
        if (data.battlerId === this.battleGrid.scene.battlerId) {
            // Play the move sound
            SoundFXManager.playSound('assets/sounds/movement/step.wav');

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

    handleAbilityAction(data) {
        console.log('Got response from ability action:', data);
        const { actionData, battlerId } = data;
        const { abilityTemplate, results, targetBattlerIds, targetTiles } = actionData;

        console.log(`Ability used: ${abilityTemplate.name}`);

        results.forEach(result => {
            const { type, amount, newMana, battlerInstance, message } = result;

            this.battleGrid.updateBattlerInstance(battlerInstance.id, battlerInstance);
            this.battleGrid.scene.updateBattlerInstance(battlerInstance.id, battlerInstance);

            if (type === 'damage') {
                this.battleGrid.scene.battlerDisplayMenu.updateResourceBars(battlerInstance.id, battlerInstance.currentStats.health, null);

                const targetBattler = this.battleGrid.getBattlerInstance(battlerInstance.id);
                targetBattler.playHitAnimation(amount);
            }

            if (type === 'manaCost') {
                this.battleGrid.scene.battlerDisplayMenu.updateResourceBars(battlerInstance.id, null, battlerInstance.currentStats.mana);
            }

            if (type === 'manaGain') {
                this.battleGrid.scene.battlerDisplayMenu.updateResourceBars(battlerInstance.id, null, battlerInstance.currentStats.mana);

                const targetBattler = this.battleGrid.getBattlerInstance(battlerInstance.id);
                targetBattler.renderBattleText(amount, '#0000ff');
            }

            if (type === 'healing') {
                this.battleGrid.scene.battlerDisplayMenu.updateResourceBars(battlerInstance.id, battlerInstance.currentStats.health, null);

                const targetBattler = this.battleGrid.getBattlerInstance(battlerInstance.id);
                targetBattler.playHealAnimation(amount);
            }
        });

        if (targetBattlerIds.length === 0 && abilityTemplate.type === 'attack') {
            if (battlerId === this.battleGrid.scene.battlerId) {
                SoundFXManager.playSound('assets/sounds/combat/miss.wav');
            }
        } else {
            SoundFXManager.playSound(`assets/sounds/${abilityTemplate.soundPath}`);
        }

        const userAnimation = abilityTemplate.type === 'attack' ? 'attack' : 'cast';
        const userBattler = this.battleGrid.getBattlerInstance(battlerId);
        userBattler.playAnimationOnce(userAnimation);

        if (battlerId === this.battleGrid.scene.battlerId) {
            const cooldownDuration = abilityTemplate.cooldownDuration;
            const cooldownType = this.actionBarMenu.getCooldownDuration(cooldownDuration);
            this.actionBarMenu.triggerGlobalCooldown(cooldownType);
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
