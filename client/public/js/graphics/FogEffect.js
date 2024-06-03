import Phaser from 'phaser';

export default class FogEffect {
    constructor(scene, brightness = 1, thickness = 1, speedX = 0.5, speedY = 0, texturePath = 'assets/images/effects/fg_fog.png') {
        this.scene = scene;
        this.texturePath = texturePath;
        this.thickness = thickness / 1.25;
        this.speedX = speedX;
        this.speedY = speedY;
        this.brightness = brightness / 1.25;
        this.ready = false;

        // Load the fog image
        this.scene.load.image(this.texturePath, this.texturePath);
        this.scene.load.once('complete', this.onLoadComplete, this);
        this.scene.load.start();
    }

    onLoadComplete() {
        const { width, height } = this.scene.game.config;

        // Create the primary fog tileSprite
        this.fog = this.scene.add.tileSprite(0, 50, width, height, this.texturePath);
        this.fog.setOrigin(0, 0);
        this.fog.setScrollFactor(0);
        this.fog.setAlpha(this.thickness);

        // Create the secondary fog tileSprite
        this.secondaryFog = this.scene.add.tileSprite(0, 50, width, height, this.texturePath);
        this.secondaryFog.setOrigin(0, 0);
        this.secondaryFog.setScrollFactor(0);
        this.secondaryFog.setAlpha(this.thickness);

        // Offset the initial tile position for the secondary fog to create a denser, non-symmetrical effect
        this.secondaryFog.tilePositionX = width / 4;

        // Adjust the brightness using tint for both fog layers
        const tint = Phaser.Display.Color.GetColor(255 * this.brightness, 255 * this.brightness, 255 * this.brightness);
        this.fog.setTint(tint);
        this.secondaryFog.setTint(tint);

        // Set the depth of the fog layers to be above the background but below other elements
        this.fog.setDepth(0);
        this.secondaryFog.setDepth(0);

        // Mark the fog as ready
        this.ready = true;

        // Hide the fog if it should be hidden initially
        if (this.hideInitially) {
            this.hide();
        }
    }

    update(time, delta) {
        if (this.fog && this.secondaryFog) {
            // Move the primary fog texture
            this.fog.tilePositionX += this.speedX * delta * 0.01;
            this.fog.tilePositionY += this.speedY * delta * 0.01;

            // Move the secondary fog texture in the inverse direction
            this.secondaryFog.tilePositionX -= this.speedX * delta * 0.01;
            this.secondaryFog.tilePositionY -= this.speedY * delta * 0.01;
        }
    }

    hide() {
        if (this.fog && this.secondaryFog) {
            this.fog.setVisible(false);
            this.secondaryFog.setVisible(false);
        } else {
            // Set a flag to hide the fog once it's ready
            this.hideInitially = true;
        }
    }

    show() {
        if (this.fog && this.secondaryFog) {
            this.fog.setVisible(true);
            this.secondaryFog.setVisible(true);
        }
    }
}
