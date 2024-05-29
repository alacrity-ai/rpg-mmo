// graphics/FogEffect.js
import Phaser from 'phaser';

export default class FogEffect {
    constructor(scene, brightness = 1, thickness = 1, speedX = 0.5, speedY = 0, texturePath = 'assets/images/effects/fg_fog.png') {
        this.scene = scene;
        this.texturePath = texturePath;
        this.thickness = thickness;
        this.speedX = speedX;
        this.speedY = speedY;
        this.brightness = brightness;
        this.ready = false;

        // Load the fog image
        this.scene.load.image(this.texturePath, this.texturePath);
        this.scene.load.once('complete', this.onLoadComplete, this);
        this.scene.load.start();
    }

    onLoadComplete() {
        const { width, height } = this.scene.game.config;

        // Create a tileSprite that is as wide as the game width and height as the game height
        this.fog = this.scene.add.tileSprite(0, 50, width, height, this.texturePath);
        this.fog.setOrigin(0, 0);
        this.fog.setScrollFactor(0);
        this.fog.setAlpha(this.thickness);

        // Adjust the brightness using tint
        const tint = Phaser.Display.Color.GetColor(255 * this.brightness, 255 * this.brightness, 255 * this.brightness);
        this.fog.setTint(tint);

        // Set the depth of the fog to be above the background but below other elements
        this.fog.setDepth(0);

        // Mark the fog as ready
        this.ready = true;

        // Hide the fog if it should be hidden initially
        if (this.hideInitially) {
            this.hide();
        }
    }

    update(time, delta) {
        if (this.fog) {
            // Move the fog texture horizontally
            this.fog.tilePositionX += this.speedX * delta * 0.01;
        }
    }

    hide() {
        if (this.fog) {
            this.fog.setVisible(false);
        } else {
            // Set a flag to hide the fog once it's ready
            this.hideInitially = true;
        }
    }

    show() {
        if (this.fog) {
            this.fog.setVisible(true);
        }
    }
}
