import IconConfig from './IconConfig.js';

export default class IconHelper {
    constructor(scene, spriteSheetKey) {
        this.scene = scene;
        this.spriteSheetKey = spriteSheetKey;
        this.columns = 16; // Update this number to match the actual number of columns in your spritesheet
    }

    getIcon(name) {
        const { x, y } = IconConfig[name];
        const frameNumber = y * this.columns + x;

        // Create a container to hold the icon and border
        const container = this.scene.add.container(0, 0);

        // Create the icon with a rounded rectangle mask
        const icon = this.scene.add.rexCircleMaskImage(0, 0, this.spriteSheetKey, frameNumber, {
            maskType: 2, // Round rectangle mask
            radius: 8    // Adjust the radius as needed
        });

        // Create the border graphics
        const border = this.scene.add.graphics();
        border.lineStyle(2, 0xffffff, 1); // White border
        border.strokeRoundedRect(-icon.width / 2, -icon.height / 2, icon.width, icon.height, 8);

        // Add the border and icon to the container
        container.add(border);
        container.add(icon);

        // Set the container to be interactive
        container.setSize(icon.width, icon.height);
        container.setInteractive(new Phaser.Geom.Rectangle(0, 0, icon.width, icon.height), Phaser.Geom.Rectangle.Contains);

        // Set up hover events for highlighting the border
        container.on('pointerover', () => {
            border.clear();
            border.lineStyle(2, 0xffff00, 1); // Yellow border
            border.strokeRoundedRect(-icon.width / 2, -icon.height / 2, icon.width, icon.height, 8);
        });

        container.on('pointerout', () => {
            border.clear();
            border.lineStyle(2, 0xffffff, 1); // White border
            border.strokeRoundedRect(-icon.width / 2, -icon.height / 2, icon.width, icon.height, 8);
        });

        console.log(`Created icon: ${name} at frame ${frameNumber}`); // Debugging info

        return container;
    }
}
