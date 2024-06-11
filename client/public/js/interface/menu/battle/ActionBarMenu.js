import { BaseMenu } from '../BaseMenu.js';
import SoundFXManager from '../../../audio/SoundFXManager.js';
import api from '../../../api';

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
        this.scene.events.on('tileFocused', ({ x, y }) => {
            this.updateButtonStates();
        });

        this.scene.events.on('tileUnfocused', ({ x, y }) => {
            this.battleGrid.clearTileSelections();
            this.updateButtonStates();
        });
    }

    async getAbilities() {
        try {
            this.abilities = await api.battler.getBattlerAbilities();
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
    
            const iconButton = this.addIconButton(iconX, iconY, ability, async () => {
                try {
                    // Get the selected tiles
                    const selectedTiles = this.calculateTargetTiles(ability);

                    // Get the battler IDs on the selected tiles
                    const battlerIdsOnSelectedTiles = selectedTiles.flatMap(([x, y]) => {
                        const tile = this.battleGrid.grid[y][x];
                        return tile.getBattlerIds(); // Get the battler IDs on the tile
                    });
    
                    // Create an array of target tile coordinates (x, y)
                    const targetTileCoordinates = selectedTiles.map(([x, y]) => [x, y]);
    
                    // Construct the action data
                    const actionData = {
                        abilityTemplate: ability,
                        targetTiles: targetTileCoordinates,
                        // If battlerIdsOnSelectedTiles is null, pass an empty array
                        targetBattlerIds: battlerIdsOnSelectedTiles || [],
                    };
    
                    // Call the API to perform the ability action
                    await api.battlerAction.addBattlerAction(
                        this.battleInstanceId,
                        this.battlerId,
                        'ability',
                        actionData
                    );
    
                    // Optionally handle the response here if needed
                    console.log('Action added successfully');
                } catch (error) {
                    console.error('Failed to add action:', error);
                }
    
                // // Trigger the cooldown for the ability with the appropriate duration
                // this.triggerGlobalCooldown(this.getCooldownDuration(ability.cooldownDuration));
            }, ability.name);
    
            this.iconButtons.push(iconButton);
        });
    
        this.updateButtonStates(); // Initial update of button states
    }      

    addIconButton(x, y, ability, callback, tooltip = null, tab = 0) {
        const { normalBorderColor, hoverBorderColor } = this.getIconButtonBorderColors(ability.targetTeam, ability.targetType);
    
        const iconButton = this.iconHelper.getIcon(ability.iconName, true, normalBorderColor, hoverBorderColor);
        iconButton.setPosition(x, y);
        iconButton.setInteractive();
        iconButton.on('pointerdown', () => {
            SoundFXManager.playSound('assets/sounds/menu/ui_2.wav');
            callback();
        });
        this.addElementToTab(tab, iconButton);
        if (tooltip) iconButton.tooltip = this.addTooltip(iconButton, tooltip);
    
        // Add a pointerOver event here to target tiles on the battle grid
        iconButton.on('pointerover', () => {
            if (ability.targetType != 'target') {
                const targetTiles = this.calculateTargetTiles(ability);
                this.battleGrid.selectTiles(targetTiles);
            }
        });
    
        // Add a pointerOut event to clear the target tiles on the battle grid
        iconButton.on('pointerout', () => {
            if (ability.targetType != 'target') {
                this.battleGrid.clearTileSelections();
            }
        });
    
        return iconButton;
    }
    

    getIconButtonBorderColors(targetTeam, targetType) {
        let normalBorderColor = 0xffffff; // Default white color
        let hoverBorderColor = 0xffff00; // Default yellow color
    
        if (targetType === 'self') {
            normalBorderColor = 0xadd8e6; // Light blue
        } else if (targetType === 'area') {
            if (targetTeam === 'hostile') {
                normalBorderColor = 0x800080; // Purple
            } else if (targetTeam === 'friendly') {
                normalBorderColor = 0x00ff00; // Green
            }
        } else if (targetType === 'relative') {
            if (targetTeam === 'hostile') {
                normalBorderColor = 0xff0000; // Red
            } else if (targetTeam === 'friendly') {
                normalBorderColor = 0x00ff00; // Green
            }
        } else if (targetType === 'target') {
            if (targetTeam === 'hostile') {
                normalBorderColor = 0xffa500; // Orange
            } else if (targetTeam === 'friendly') {
                normalBorderColor = 0x32cd32; // Lime green
            }
        }
    
        return { normalBorderColor, hoverBorderColor };
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
                if (battlerX + x < 3) {
                    targetTiles.push([battlerX + x, battlerY + y, true])
                } else {
                    targetTiles.push([battlerX + x, battlerY + y, false]);
                }    
            });
        } else if (ability.targetType === 'target') {
            if (this.battleGrid.tileFocused) {
                targetTiles.push(this.battleGrid.selectedTiles[0]);
            }
        }

        // Filter out any tiles that are out of bounds (x > 5 or y > 2 or x < 0 or y < 0)
        return targetTiles.filter(([x, y]) => x >= 0 && x < 6 && y >= 0 && y < 3);
    }

    updateButtonStates() {
        const battlerPosition = this.battleGrid.getBattlerPosition(this.battlerId);
    
        this.iconButtons.forEach((iconButton, index) => {
            const ability = this.abilities[index];
    
            if (this.shouldDisableIcon(ability, battlerPosition)) {
                this.disableIcon(iconButton); // Greyed out
                // iconButton.tooltip.setVisible(false);
            } else {
                this.enableIcon(iconButton); // Normal state
            }
        });
    }

    shouldDisableIcon(ability, battlerPosition) {
            const requiredCoords = ability.requiredCoords || [];

            console.log('CHECKING: ability.cost and current mana: ', ability.cost, this.scene.battler.currentStats.mana)
            // If the user doesn't have enough mana, disable the icon
            if (ability.cost > this.scene.battler.currentStats.mana) {
                return true;
            }

            // If a tile is focused, and this ability's targetType is not 'target', disable the icon
            if (this.battleGrid.tileFocused && ability.targetType !== 'target') {
                return true
            }
    
            // If a tile is not focused, and this ability's targetType is 'target', disable the icon
            if (!this.battleGrid.tileFocused && ability.targetType === 'target') {
                return true
            }
    
            // Check if the selected tile matches the ability's target team
            if (this.battleGrid.tileFocused) {
                const selectedTileX = this.battleGrid.selectedTiles[0][0];
                const isFriendlyTile = selectedTileX < 3;
                const isHostileTile = selectedTileX >= 3;
    
                if ((ability.targetTeam === 'friendly' && !isFriendlyTile) || (ability.targetTeam === 'hostile' && !isHostileTile)) {
                    return true;
                }
            }
    
            // If requiredCoords is empty, enable the icon
            if (requiredCoords.length === 0) {
                return false;
            }
    
            const isInRequiredCoords = requiredCoords.some(([x, y]) => x === battlerPosition[0] && y === battlerPosition[1]);
    
            if (isInRequiredCoords) {
                return false;
            } else {
                return true;
            }

    }

    disableIcon(iconButton) {
        iconButton.disableInteractive();
        this.iconHelper.setTint(iconButton, 0x444444);
        this.iconHelper.setBorderTint(iconButton, 0x444444);
        iconButton.tooltip.setVisible(false);
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
            case 'shorter':
                return cooldownSettings.shorter;
            case 'short':
                return cooldownSettings.short;
            case 'normal':
                return cooldownSettings.normal;
            case 'long':
                return cooldownSettings.long;
            case 'longer':
                return cooldownSettings.longer;
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
