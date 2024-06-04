import IconConfig from './IconConfig.js';

export default class IconHelper {
    constructor(scene, spriteSheetKey) {
        this.scene = scene;
        this.spriteSheetKey = spriteSheetKey;
        this.columns = 16; // Update this number to match the actual number of columns in your spritesheet
    }

    getIcon(name, hasBorder = true, normalBorderColor = 0xffffff, hoverBorderColor = 0xffff00) {
        const { x, y } = IconConfig[name];
        const frameNumber = y * this.columns + x;
    
        // Create a container to hold the icon and border
        const container = this.scene.add.container(0, 0);
    
        // Create the icon with a rounded rectangle mask
        const icon = this.scene.add.rexCircleMaskImage(0, 0, this.spriteSheetKey, frameNumber, {
            maskType: 2, // Round rectangle mask
            radius: 8    // Adjust the radius as needed
        });
    
        if (hasBorder) {
            // Create the border graphics
            const border = this.scene.add.graphics();
            border.lineStyle(2, normalBorderColor, 1); // Normal border color
            border.strokeRoundedRect(-icon.width / 2, -icon.height / 2, icon.width, icon.height, 8);
    
            // Add the border to the container
            container.add(border);
    
            // Store a reference to the border for later use
            container.border = border;
    
            // Set up hover events for highlighting the border
            container.on('pointerover', () => {
                border.clear();
                border.lineStyle(2, hoverBorderColor, 1); // Hover border color
                border.strokeRoundedRect(-icon.width / 2, -icon.height / 2, icon.width, icon.height, 8);
            });
    
            container.on('pointerout', () => {
                border.clear();
                border.lineStyle(2, normalBorderColor, 1); // Normal border color
                border.strokeRoundedRect(-icon.width / 2, -icon.height / 2, icon.width, icon.height, 8);
            });
        }
    
        // Add the icon to the container
        container.add(icon);
    
        // Save the normalBorderColor and hoverBorderColor
        container.border.normalBorderColor = normalBorderColor;
        container.border.hoverBorderColor = hoverBorderColor;

        // Store a reference to the icon for tinting and spinner
        container.iconImage = icon;
        container.spinnerMask = null;
    
        // Set the container to be interactive
        container.setSize(icon.width, icon.height);
        container.setInteractive(new Phaser.Geom.Rectangle(0, 0, icon.width, icon.height), Phaser.Geom.Rectangle.Contains);
    
        return container;
    }    

    setTint(container, color) {
        if (container.iconImage) {
            container.iconImage.setTint(color);
        }
    }

    clearTint(container) {
        if (container.iconImage) {
            container.iconImage.clearTint();
        }
    }

    setBorderTint(container, color) {
        if (container.border) {
            container.border.clear();
            container.border.lineStyle(2, color, 1); // Set border color
            container.border.strokeRoundedRect(-container.iconImage.width / 2, -container.iconImage.height / 2, container.iconImage.width, container.iconImage.height, 8);
        }
    }
    
    clearBorderTint(container) {
        if (container.border) {
            container.border.clear();
            container.border.lineStyle(2, container.border.normalBorderColor, 1); // Reset to original border color
            container.border.strokeRoundedRect(-container.iconImage.width / 2, -container.iconImage.height / 2, container.iconImage.width, container.iconImage.height, 8);
        }
    }

    resetBorderColor(container) {
        if (container.border) {
            container.border.clear();
            container.border.lineStyle(2, 0xffffff, container.border.normalBorderColor); // Reset to white border
            container.border.strokeRoundedRect(-container.iconImage.width / 2, -container.iconImage.height / 2, container.iconImage.width, container.iconImage.height, 8);
        }
    }

    addCooldownTimer(container, duration) {
        const mask = this.scene.add.graphics().setVisible(false);
        mask.x = container.x;
        mask.y = container.y;
        container.iconImage.mask = new Phaser.Display.Masks.BitmapMask(this.scene, mask);

        this.scene.tweens.add({
            targets: { hiddenPercent: 0 },
            hiddenPercent: 1,
            ease: 'Linear',
            duration: duration,
            onUpdate: tween => {
                const hiddenPercent = tween.targets[0].hiddenPercent;
                mask.clear();
                mask.fillStyle(0x808080, 0.9); // Semi-transparent grey
                mask.beginPath();
                mask.slice(
                    0, 0, 
                    container.iconImage.width / 2, 
                    -Math.PI / 2, 
                    (2 * Math.PI * hiddenPercent) - Math.PI / 2, 
                    false
                );
                mask.fillPath();
            },
            onComplete: () => {
                mask.destroy();
                container.iconImage.clearMask();
            }
        });
    }
}
