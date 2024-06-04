import { BaseMenu } from './BaseMenu.js';
import SoundFXManager from '../../audio/SoundFXManager.js';
import api from '../../api/battler';

export default class ActionBarMenu extends BaseMenu {
    constructor(scene, battleInstanceId, battlerId, battleGrid) {
        const x = scene.sys.game.config.width / 2;
        const y = scene.sys.game.config.height - 34; // Positioning at the bottom of the screen
        const width = 512;
        const height = 48;
        const hasCloseButton = false;
        const backgroundColor = 0x000000;
        const backgroundAlpha = 0.8;
        const borderRadius = 10;

        // Instantiate menu with the specified parameters
        super(scene, x, y, width, height, backgroundColor, backgroundAlpha, borderRadius, null, null, hasCloseButton, true, true); // Added an additional true here to make sure that it renders the window border

        this.battleInstanceId = battleInstanceId;
        this.battlerId = battlerId;
        this.battleGrid = battleGrid;
        this.isCooldownActive = false; // Track the cooldown state
        this.abilities = []; // Initialize abilities array

        this.getAbilities(); // Call the new method here
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Add any event listeners here
    }

    async getAbilities() {
        try {
            this.abilities = await api.getBattlerAbilities();
            this.createActionBar(this.abilities);
        } catch (error) {
            console.error('Failed to get abilities:', error);
            this.abilities = [];
            this.createActionBar([]); // Create an empty action bar if the call fails
        }
    }

    createActionBar(abilities) {
        const iconWidth = 48;
        const padding = 0;

        this.iconButtons = [];

        abilities.forEach((ability, index) => {
            const iconX = this.x - (this.width / 2) + iconWidth / 2 + index * (iconWidth + padding);
            const iconY = this.y;

            const iconButton = this.addIconButton(iconX, iconY, ability, () => {
                // Trigger the cooldown for the ability with the appropriate duration
                this.triggerGlobalCooldown(this.getCooldownDuration(ability.cooldownDuration));
            }, ability.name);

            this.iconButtons.push(iconButton);
        });

        this.updateButtonStates(); // Initial update of button states
    }

    addIconButton(x, y, ability, callback, tooltip = null, tab = 0) {
        const iconButton = this.iconHelper.getIcon(ability.iconName);
        iconButton.setPosition(x, y);
        iconButton.setInteractive();
        iconButton.on('pointerdown', () => {
            SoundFXManager.playSound('assets/sounds/menu/ui_2.wav');
            callback();
        });
        this.addElementToTab(tab, iconButton);
        if (tooltip) this.addTooltip(iconButton, tooltip);

        // Add a pointerOver event here to target tiles on the battle grid
        iconButton.on('pointerover', () => {
            const targetTiles = this.calculateTargetTiles(ability);
            this.battleGrid.selectTiles(targetTiles);
        });

        // Add a pointerOut event to clear the target tiles on the battle grid
        iconButton.on('pointerout', () => {
            this.battleGrid.clearTileSelections();
        });

        return iconButton;
    }

    calculateTargetTiles(ability) {
        const targetTiles = [];

        if (ability.targetType === 'self') {
            const position = this.battleGrid.getBattlerPosition(this.battlerId);
            targetTiles.push(position);
        } else if (ability.targetType === 'area') {
            if (ability.targetTeam === 'friendly') {
                targetTiles.push(...ability.targetArea);
            } else if (ability.targetTeam === 'hostile') {
                ability.targetArea.forEach(([x, y]) => {
                    targetTiles.push([x + 3, y]);
                });
            }
        } else if (ability.targetType === 'relative') {
            const battlerPosition = this.battleGrid.getBattlerPosition(this.battlerId);
            const [battlerX, battlerY] = battlerPosition;
            ability.targetArea.forEach(([x, y]) => {
                targetTiles.push([battlerX + x, battlerY + y]);
            });
        } else if (ability.targetType === 'target') {
            // Placeholder for target logic
        }

        // Filter out any tiles that are out of bounds (x > 5 or y > 2 or x < 0 or y < 0)
        return targetTiles.filter(([x, y]) => x >= 0 && x < 6 && y >= 0 && y < 3);
    }

    updateButtonStates() {
        const battlerPosition = this.battleGrid.getBattlerPosition(this.battlerId);
    
        this.iconButtons.forEach((iconButton, index) => {
            const ability = this.abilities[index];
            const requiredCoords = ability.requiredCoords || [];
    
            // If requiredCoords is empty, enable the icon
            if (requiredCoords.length === 0) {
                this.enableIcon(iconButton); // Normal state
                return;
            }
    
            const isInRequiredCoords = requiredCoords.some(([x, y]) => x === battlerPosition[0] && y === battlerPosition[1]);
    
            if (isInRequiredCoords) {
                this.enableIcon(iconButton); // Normal state
            } else {
                this.disableIcon(iconButton); // Greyed out
            }
        });
    }    

    disableIcon(iconButton) {
        iconButton.disableInteractive();
        this.iconHelper.setTint(iconButton, 0x444444);
        this.iconHelper.setBorderTint(iconButton, 0x444444);
    }

    enableIcon(iconButton) {
        iconButton.setInteractive();
        this.iconHelper.clearTint(iconButton);
        this.iconHelper.clearBorderTint(iconButton);
    }

    getCooldownDuration(duration) {
        const cooldownSettings = this.scene.registry.get('settings').cooldowns;
        switch (duration) {
            case 'minimum':
                return cooldownSettings.minimum;
            case 'short':
                return cooldownSettings.short;
            case 'normal':
                return cooldownSettings.normal;
            case 'long':
                return cooldownSettings.long;
            default:
                return cooldownSettings.normal; // Default to normal if duration is unknown
        }
    }

    isOnCooldown() {
        return this.isCooldownActive;
    }

    triggerGlobalCooldown(delayAmount) {
        this.isCooldownActive = true; // Set cooldown state to active
        this.disableIcons(delayAmount);
        this.scene.time.delayedCall(delayAmount, () => {
            this.updateButtonStates(); // Update button states after cooldown
            this.isCooldownActive = false; // Reset cooldown state to inactive
        });
    }

    disableIcons(delayAmount) {
        this.iconButtons.forEach(container => {
            this.disableIcon(container); // Disable interactivity and apply tint
            this.iconHelper.addCooldownTimer(container, delayAmount); // Add spinner effect for delayAmount
        });
    }

    enableIcons() {
        this.iconButtons.forEach(container => {
            this.enableIcon(container); // Re-enable interactivity and clear tint
        });
    }
}
