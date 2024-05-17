import Phaser from 'phaser';
import CharacterRenderer from '../graphics/CharacterRenderer.js';

export default class TestScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TestScene' });
    }

    preload() {
        // Initialize CharacterRenderer
        this.characterRenderer = new CharacterRenderer(this, 1, 'priest', 1, true);
    }

    create() {
        // Play the initial character animation (idle) at coordinates (525, 300)
        this.characterRenderer.playAnimation('idle', 525, 300);

        // Example of running the 'attack' animation once after a delay
        this.time.delayedCall(2000, () => {
            this.characterRenderer.runOnce('attack');
        }, [], this);

        // Example of running the 'cast' animation once after another delay
        this.time.delayedCall(4000, () => {
            this.characterRenderer.runOnce('cast');
        }, [], this);

        // Example of running the 'talk' animation once after another delay
        this.time.delayedCall(6000, () => {
            this.characterRenderer.runOnce('talk');
        }, [], this);
    }

    update(time, delta) {
        // Update logic here if needed
    }
}
