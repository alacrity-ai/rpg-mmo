import { BaseMenu } from './BaseMenu.js';
import SoundFXManager from '../../audio/SoundFXManager.js';

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
        this.createActionBar();
        this.createActionNavigationBar(); // Call the new method here
    }

    createActionBar() {
        const iconNames = ['apple', 'banana', 'pear', 'lemon', 'strawberry', 'grapes'];
        const iconWidth = 48; // Assuming each icon is 48x48 pixels
        const padding = 0; // Padding between icons

        this.iconButtons = [];

        iconNames.forEach((iconName, index) => {
            const iconX = this.x - (this.width / 2) + iconWidth / 2 + index * (iconWidth + padding);
            const iconY = this.y;

            const iconButton = this.addIconButton(iconX, iconY, iconName, () => {
                console.log(`${iconName} icon clicked`);
                this.triggerGlobalCooldown();
            });

            this.iconButtons.push(iconButton);
        });
    }

    createActionNavigationBar() {
        const navX = this.x - this.width / 2 - 84; // Position the navigation bar to the left of the action bar
        const navY = this.y - 40; // Center vertically with the action bar
        const navWidth = 128;
        const navHeight = 128;

        // Create the navigation window (assuming BaseMenu can be used to create simple windows)
        const navWindow = this.scene.add.rectangle(navX, navY, navWidth, navHeight, 0x000000, 0.8);
        this.scene.add.existing(navWindow);

        // Define the pixel spacing between buttons
        const spacing = 8;

        // Icon names for navigation buttons
        const navIcons = [
            { name: 'arrow-up-blue', x: navX, y: navY - 32 - spacing, direction: [0, -1] },
            { name: 'arrow-upright-blue', x: navX + 32 + spacing, y: navY - 32 - spacing, direction: [1, -1] },
            { name: 'arrow-right-blue', x: navX + 32 + spacing, y: navY, direction: [1, 0] },
            { name: 'arrow-downright-blue', x: navX + 32 + spacing, y: navY + 32 + spacing, direction: [1, 1] },
            { name: 'arrow-down-blue', x: navX, y: navY + 32 + spacing, direction: [0, 1] },
            { name: 'arrow-downleft-blue', x: navX - 32 - spacing, y: navY + 32 + spacing, direction: [-1, 1] },
            { name: 'arrow-left-blue', x: navX - 32 - spacing, y: navY, direction: [-1, 0] },
            { name: 'arrow-upleft-blue', x: navX - 32 - spacing, y: navY - 32 - spacing, direction: [-1, -1] }
        ];

        navIcons.forEach(icon => {
            const iconButton = this.addIconButton(icon.x, icon.y, icon.name, () => {
                console.log(`${icon.name} icon clicked`);
                this.triggerGlobalCooldown();

                // Emit the event with direction data
                this.scene.events.emit('navigationButtonClicked', icon.direction);
            });

            this.iconButtons.push(iconButton);
        });
    }

    addIconButton(x, y, iconName, callback, tooltip = null, tab = 0) {
        const iconButton = this.iconHelper.getIcon(iconName);
        iconButton.setPosition(x, y);
        iconButton.setInteractive();
        iconButton.on('pointerdown', () => {
            SoundFXManager.playSound('assets/sounds/menu/ui_2.wav');
            callback();
        });
        this.addElementToTab(tab, iconButton);
        if (tooltip) this.addTooltip(iconButton, tooltip);

        return iconButton;
    }

    triggerGlobalCooldown() {
        this.disableIcons();
        this.scene.time.delayedCall(3000, this.enableIcons, [], this); // 3000 milliseconds = 3 seconds
    }

    disableIcons() {
        this.iconButtons.forEach(container => {
            container.disableInteractive(); // Disable interactivity
            this.iconHelper.setTint(container, 0x888888); // Apply tint to the icon image
            this.iconHelper.resetBorderColor(container); // Reset border color to white
            this.iconHelper.addCooldownTimer(container, 3000); // Add spinner effect for 3 seconds
        });
    }

    enableIcons() {
        this.iconButtons.forEach(container => {
            container.setInteractive(); // Re-enable interactivity
            this.iconHelper.clearTint(container); // Clear tint from the icon image
        });
    }
}
