import SocketManager from "../../SocketManager.js";
import SoundFXManager from '../../audio/SoundFXManager.js';
import getCooldownDuration from "./helpers/getCooldownDuration.js";

export default class BattleActionResponseHandler {
    constructor(battleGrid, actionBarMenu, settings) {
        this.battleGrid = battleGrid;
        this.actionBarMenu = actionBarMenu;
        this.battlerDisplayMenu = battleGrid.scene.battlerDisplayMenu;
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
        // if the data.battlerId is the same as the current player's battlerId, trigger the global cooldown
        if (data.battlerId === this.battleGrid.scene.battlerId) {
            // Play the move sound
            SoundFXManager.playSound('assets/sounds/movement/step.wav');
            this.actionBarMenu.addCanQueueAbility(this.settings.cooldowns.short);
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
        const { actionData, battlerId } = data;
        const { abilityTemplate, results, targetBattlerIds, targetTiles } = actionData;
        const userBattler = this.battleGrid.getBattlerInstance(battlerId);

        results.forEach(result => {
            const { success, type, amount, battlerInstance, message } = result;

            this.battleGrid.updateBattlerInstance(battlerInstance.id, battlerInstance);
            this.battleGrid.scene.updateBattlerInstance(battlerInstance.id, battlerInstance);

            if (type === 'damage') {
                this.battleGrid.scene.battlerDisplayMenu.updateResourceBars(battlerInstance.id, battlerInstance.currentStats.health, null);
                const targetBattler = this.battleGrid.getBattlerInstance(battlerInstance.id);
                targetBattler.playHitAnimation(amount);

                // Dynamically import the abilityTemplate.animationScript and execute the animation
                try {
                    import(`../../battle/abilityAnimations/${abilityTemplate.animationScript}`).then((module) => {
                        const AnimationScriptClass = module.default;
                        const animationScript = new AnimationScriptClass(this.battleGrid.scene, this.battleGrid, userBattler, targetBattler);
                        animationScript.execute();
                    }).catch((error) => {
                        console.error(`Failed to load animation script: ${abilityTemplate.animationScript}`, error);
                    });   
                } catch (error) {
                    console.error('Failed to load animation script:', error);
                }
            }
            if (type === 'death') {
                this.battleGrid.killBattler(battlerInstance.id)
                this.battlerDisplayMenu.removeBattler(battlerInstance.id);
            }

            if (type === 'manaCost') {
                this.battleGrid.scene.battlerDisplayMenu.updateResourceBars(userBattler.battlerData.id, null, userBattler.battlerData.currentStats.mana);
            }

            if (type === 'manaGain') {
                this.battleGrid.scene.battlerDisplayMenu.updateResourceBars(userBattler.battlerData.id, null, userBattler.battlerData.currentStats.mana);
                userBattler.renderBattleText(amount, '#0000ff');
            }

            if (type === 'healing') {
                this.battleGrid.scene.battlerDisplayMenu.updateResourceBars(battlerInstance.id, battlerInstance.currentStats.health, null);

                const targetBattler = this.battleGrid.getBattlerInstance(battlerInstance.id);
                targetBattler.playHealAnimation(amount);
            }
        });

        // If the ability is an attack, play the appropriate sound effect
        if (targetBattlerIds.length === 0 && abilityTemplate.type === 'attack') {
            if (battlerId === this.battleGrid.scene.battlerId) {
                SoundFXManager.playSound('assets/sounds/combat/miss.wav');
            }
        } else {
            SoundFXManager.playSound(`assets/sounds/${abilityTemplate.soundPath}`);
            // Delay the enemy getting hit sound effect for impact
            setTimeout(() => {
                SoundFXManager.playSound('assets/sounds/combat/hit.wav');
            }, 150);
        }

        // Play the user's animation
        if (abilityTemplate.type === 'attack') {
            userBattler.playAttackAnimation();
        } else if (abilityTemplate.type === 'spell' || abilityTemplate.type === 'ability') {
            userBattler.playAnimationOnce('cast');
        }

        // Trigger the cooldown for the user's ability
        if (battlerId === this.battleGrid.scene.battlerId) {
            const cooldownDuration = abilityTemplate.cooldownDuration;
            const cooldownType = getCooldownDuration(this.settings, cooldownDuration);
            this.actionBarMenu.addCanQueueAbility(cooldownType);
            this.actionBarMenu.triggerGlobalCooldown(cooldownType);
        }
    }    

    initialize() {
        const socket = SocketManager.getSocket();
        socket.on('completedBattlerAction', this.handleCompletedBattlerAction.bind(this));
    }

    cleanup() {
        const socket = SocketManager.getSocket();
        socket.removeAllListeners('completedBattlerAction');
    }
}
