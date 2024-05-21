import Phaser from 'phaser';
import TutorialMenu from '../../interface/menu/TutorialMenu.js';
import DialogueMenu from '../../interface/menu/DialogueMenu.js';
import LoginMenu from '../../interface/menu/LoginMenu.js';
import TableMenu from '../../interface/menu/TableMenu.js';
import ErrorMenu from '../../interface/menu/ErrorMenu.js';

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

        // Define some items for the table menu
        const items = [
            { name: 'Sword', price: 50 },
            { name: 'Shield', price: 75 },
            { name: 'Potion', price: 10 },
            { name: 'Helmet', price: 30 },
            { name: 'Armor', price: 100 },
            { name: 'Boots', price: 40 },
            { name: 'Ring', price: 25 },
            { name: 'Amulet', price: 60 },
            { name: 'Bow', price: 85 },
            { name: 'Arrow', price: 5 },
            { name: 'Staff', price: 120 },
            { name: 'Gloves', price: 20 },
            { name: 'Cloak', price: 50 },
            { name: 'Dagger', price: 35 },
            { name: 'Axe', price: 90 },
            { name: 'Spear', price: 110 },
            { name: 'Gauntlets', price: 45 },
            { name: 'Belt', price: 15 },
            { name: 'Bracers', price: 25 },
            { name: 'Greaves', price: 55 }
        ];

        // Create and show the table menu
        this.tableMenu = new TableMenu(this, items);
        this.tableMenu.show();

        // Add an event listener to the close button of the table menu
        this.tableMenu.onClose = () => {
            this.time.delayedCall(1000, () => {
                // Show the error menu after a 1-second delay
                const errorMessage = "An error occurred! Please try again later.";
                this.errorMenu = new ErrorMenu(this, errorMessage);
                this.errorMenu.show();

                this.errorMenu.onClose = () => {
                    this.time.delayedCall(1000, () => {
                        // Show the login menu after a 1-second delay
                        this.loginMenu = new LoginMenu(this);
                        this.loginMenu.show();

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
            });
        };
    }

    update(time, delta) {
        // Update logic here if needed
    }
}
