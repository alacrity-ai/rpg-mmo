import { BaseMenu } from '../BaseMenu.js';
import getIconButtonBorderColors from './utils/getIconButtonBorderColors.js';
import calculateTargetTiles from './utils/calculateTargetTiles.js';
import shouldDisableIcon from './utils/shouldDisableIcon.js';
import { getCooldownDuration } from '../../../scenes/handlers/helpers/getCooldownDuration.js';
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
        this.abilityQueued = null; // Track queued ability
        this.settings = this.scene.registry.get('settings'); // Get the settings from the registry

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
                    const selectedTiles = calculateTargetTiles(ability, this.battleGrid, this.battlerId);

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
    
                    // If a targetType = target ability used, clear the tile selections
                    if (ability.targetType === 'target') {
                        this.battleGrid.clearTileSelections();
                    }

                    // Optionally handle the response here if needed
                    console.log('Action added successfully');
                } catch (error) {
                    console.error('Failed to add action:', error);
                }
            }, ability.name);
    
            this.iconButtons.push({ button: iconButton, ability });
        });
    
        this.updateButtonStates(); // Initial update of button states
    }      

    addIconButton(x, y, ability, callback, tooltip = null, tab = 0) {
        const { normalBorderColor, hoverBorderColor } = getIconButtonBorderColors(ability.targetTeam, ability.targetType);
    
        const iconButton = this.iconHelper.getIcon(ability.iconName, true, normalBorderColor, hoverBorderColor);
        iconButton.setPosition(x, y);
        iconButton.setInteractive();
        // Set original callback to a function that logs to console and then calls the callback
        iconButton.originalCallback = () => {
            this.handlePointerOver(ability);
            if (!this.isOnCooldown()) {
                callback();
            }
        };
        // iconButton.originalCallback = callback;
        iconButton.on('pointerdown', callback);
        this.addElementToTab(tab, iconButton);
        if (tooltip) iconButton.tooltip = this.addTooltip(iconButton, tooltip);

        // Store the pointerover and pointerout handlers
        iconButton.pointerOverHandler = () => this.handlePointerOver(ability);
        iconButton.pointerOutHandler = () => this.handlePointerOut(ability);

        // Add a pointerOver event here to target tiles on the battle grid
        iconButton.on('pointerover', iconButton.pointerOverHandler);
    
        // Add a pointerOut event to clear the target tiles on the battle grid
        iconButton.on('pointerout', iconButton.pointerOutHandler);
        
        return iconButton;
    }

    addCanQueueAbility(cooldownLengthMs) {
        this.scene.time.delayedCall(cooldownLengthMs * 0.5, () => {
            // Change border of button to green
            // Faint light blue with low saturation = 0x00ffff
            // Even fainter with lower saturation = 0x00cccc
            // Lower saturation, more grey blue = 0x009999
            // Yellow = 0xffff00
            // Very pale yellow = 0xffffcc
            this.changeIconBorders('0x009999');
            // for every icon button:
            this.iconButtons.forEach(({ button, ability }) => {
                button.on('pointerdown', () => {
                    if (this.isOnCooldown()) {
                        this.changeIconBorders('0xffffcc');
                        this.abilityQueued = { button, ability, callback: button.originalCallback };
                    }
                });
            });
        });
    }

    changeIconBorders(color) {
        // Get all icon buttons
        this.iconButtons.forEach(({ button: iconButton }) => {
            // Change border of button to light blue
            this.iconHelper.setBorderTint(iconButton, color);
        });
    }

    handlePointerOver(ability) {
        if (ability.targetType != 'target') {
            const targetTiles = calculateTargetTiles(ability, this.battleGrid, this.battlerId);
            this.battleGrid.selectTiles(targetTiles);
        }
    }

    handlePointerOut(ability) {
        if (ability.targetType != 'target') {
            this.battleGrid.clearTileSelections();
        }
    }

    updateButtonStates() {
        const battlerPosition = this.battleGrid.getBattlerPosition(this.battlerId);
    
        this.iconButtons.forEach(({ button: iconButton, ability }, index) => {
            if (shouldDisableIcon(ability, battlerPosition, this.battleGrid)) {
                this.setIconState(iconButton, false); // Greyed out
            } else {
                this.setIconState(iconButton, true); // Normal state
            }
        });
    }

    setIconState(iconButton, enabled) {
        if (enabled) {
            this.enableIcon(iconButton);
        } else {
            this.disableIcon(iconButton);
        }
    }

    disableIcon(iconButton) {
        this.iconHelper.setTint(iconButton, 0x444444);
        this.iconHelper.setBorderTint(iconButton, 0x444444);
        iconButton.tooltip.setVisible(false);

        // Remove the original callback and add the new one to clear tile selections
        iconButton.off('pointerdown', iconButton.originalCallback);
        iconButton.on('pointerdown', () => {
            if (!this.isOnCooldown()) {
                this.battleGrid.clearTileSelections();
                this.updateButtonStates();
            }
            // Manually trigger the pointerover event to show target tiles
            iconButton.pointerOverHandler();
        });

        // Remove the pointerover and pointerout handlers
        if (this.battleGrid.tileFocused) {
            iconButton.off('pointerover', iconButton.pointerOverHandler);
        }
        iconButton.off('pointerout', iconButton.pointerOutHandler);
    }

    enableIcon(iconButton) {
        iconButton.setInteractive();
        this.iconHelper.clearTint(iconButton);
        this.iconHelper.clearBorderTint(iconButton);

        // Remove the clear tile selections callback and restore the original callback
        iconButton.off('pointerdown');
        iconButton.on('pointerdown', iconButton.originalCallback);

        // Restore the pointerover and pointerout handlers
        iconButton.on('pointerover', iconButton.pointerOverHandler);
        iconButton.on('pointerout', iconButton.pointerOutHandler);
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

            // If an ability was queued, use it
            if (this.abilityQueued) {
                const { iconButton, ability, callback } = this.abilityQueued;
                this.scene.time.delayedCall(10, () => {
                    callback(); // Use the queued ability
                    this.abilityQueued = null; // Clear the queued ability
                    const queuedDelay = getCooldownDuration(this.settings, ability.cooldown);
                    this.triggerGlobalCooldown(queuedDelay);
                });
            }
        });
    }

    disableIcons(delayAmount) {
        this.iconButtons.forEach(({ button: container }) => {
            this.disableIcon(container); // Disable interactivity and apply tint
            this.iconHelper.addCooldownTimer(container, delayAmount); // Add spinner effect for delayAmount
        });
    }

    enableIcons() {
        this.iconButtons.forEach(({ button: container }) => {
            this.enableIcon(container); // Re-enable interactivity and clear tint
        });
    }
}
