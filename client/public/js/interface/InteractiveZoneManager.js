export default class InteractiveZoneManager {
    constructor(scene) {
        this.scene = scene;
        this.hoverTextBackground = this.scene.add.graphics();
        this.hoverText = this.scene.add.text(this.scene.sys.game.config.width / 2, 30, '', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5, 0.5).setVisible(false);
    }

    createInteractiveArea(x, y, width, height, text, callback) {
        // Create an invisible interactive zone
        const zone = this.scene.add.zone(x, y, width, height).setOrigin(0, 0).setInteractive();

        // Show the text and background when the pointer is over the zone
        zone.on('pointerover', () => {
            this.hoverText.setText(text);
            this.hoverText.setVisible(true);
            this.hoverTextBackground.clear();
            this.hoverTextBackground.fillStyle(0x000000, 0.7);
            const textWidth = this.hoverText.width + 20;
            const textHeight = this.hoverText.height + 10;
            const radius = 10;
            this.hoverTextBackground.fillRoundedRect((this.scene.sys.game.config.width - textWidth) / 2, 10, textWidth, textHeight, radius);
        });

        // Hide the text and background when the pointer is out of the zone
        zone.on('pointerout', () => {
            this.hoverText.setVisible(false);
            this.hoverTextBackground.clear();
        });

        // Execute the callback function when the area is clicked
        zone.on('pointerdown', () => {
            if (callback) {
                callback();
            }
        });
    }
}
