import Phaser from 'phaser';
import TutorialMenu from '../interface/menu/TutorialMenu.js';

export default class TestScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TestScene' });
    }

    preload() {
        // Preload necessary assets here if any
        this.load.image('background', 'assets/images/zones/town-1/town.png');
    }

    create() {
        // Add the background image and ensure it fits the canvas
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

        // Create and show the tutorial menu
        const tutorialText = "Welcome to the tutorial! Follow the instructions to learn how to play the game.";
        this.tutorialMenu = new TutorialMenu(this, tutorialText);
        this.tutorialMenu.show();
    }

    update(time, delta) {
        // Update logic here if needed
    }
}
