import Phaser from 'phaser';
import TutorialMenu from '../interface/menu/TutorialMenu.js';
import DialogueMenu from '../interface/menu/DialogueMenu.js';
import LoginMenu from '../interface/menu/LoginMenu.js';
import ErrorMenu from '../interface/menu/ErrorMenu.js';

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

        // Create and show the error menu
        const errorMessage = "Oh no! Something went terribly wrong. Please try again.";
        this.errorMenu = new ErrorMenu(this, errorMessage);
        this.errorMenu.show();

        // Add an event listener to the close button of the error menu
        this.errorMenu.onClose = () => {
            this.time.delayedCall(1000, () => {
                // Show the login menu after a 1-second delay
                this.loginMenu = new LoginMenu(this);
                this.loginMenu.show();

                // Add an event listener to the close button of the login menu
                this.loginMenu.onClose = () => {
                    this.time.delayedCall(1000, () => {
                        // Show the tutorial menu after a 1-second delay
                        const tutorialText = "Welcome to the tutorial! Follow the instructions to learn how to play the game.";
                        this.tutorialMenu = new TutorialMenu(this, tutorialText);
                        this.tutorialMenu.show();

                        // Add an event listener to the close button of the tutorial menu
                        this.tutorialMenu.onClose = () => {
                            this.time.delayedCall(1000, () => {
                                // Show the dialogue menu after a 1-second delay
                                const knightDialogue = "Greetings, brave adventurer! Prepare yourself for the trials ahead.";
                                const atlasPath = 'assets/images/characters/knight/portrait/atlas.png';
                                this.dialogueMenu = new DialogueMenu(this, atlasPath, knightDialogue);
                                this.dialogueMenu.show();
                            });
                        };
                    });
                };
            });
        };
    }

    update(time, delta) {
        // Update logic here if needed
    }
}
