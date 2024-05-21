import Phaser from 'phaser';
import TutorialMenu from '../../interface/menu/TutorialMenu.js';
import DialogueMenu from '../../interface/menu/DialogueMenu.js';
import LoginMenu from '../../interface/menu/LoginMenu.js';
import ShopMenu from '../../interface/menu/ShopMenu.js';
import ErrorMenu from '../../interface/menu/ErrorMenu.js';

export default class MenuTestScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuTestScene' });
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
            { name: 'Sword', price: 50, description: 'A sharp blade.', icon: 'iron-sword' },
            { name: 'Shield', price: 75, description: 'Protects you from attacks.', icon: 'round-shield' },
            { name: 'Potion', price: 10, description: 'Heals 50 HP.', icon: 'potion-red' },
            { name: 'Helmet', price: 30, description: 'Protects your head.', icon: 'knight-helmet' },
            { name: 'Armor', price: 100, description: 'Provides strong protection.', icon: 'steel-cuirass' },
            { name: 'Boots', price: 40, description: 'Increases your speed.', icon: 'leather-boots' },
            { name: 'Ring', price: 25, description: 'A magical ring.', icon: 'gold-ring' },
            { name: 'Amulet', price: 60, description: 'A powerful amulet.', icon: 'gold-necklace' },
            { name: 'Bow', price: 85, description: 'A long-range weapon.', icon: 'bow-and-arrow' },
            { name: 'Arrow', price: 5, description: 'Ammunition for a bow.', icon: 'arrow-head' },
            { name: 'Staff', price: 120, description: 'A magical staff.', icon: 'crook' },
            { name: 'Gloves', price: 20, description: 'Protects your hands.', icon: 'leather-gloves' },
            { name: 'Cloak', price: 50, description: 'Provides stealth.', icon: 'purple-cloak' },
            { name: 'Dagger', price: 35, description: 'A short blade.', icon: 'dagger' },
            { name: 'Axe', price: 90, description: 'A heavy weapon.', icon: 'axe' },
            { name: 'Spear', price: 110, description: 'A long-range weapon.', icon: 'arrow-head' },
            { name: 'Gauntlets', price: 45, description: 'Protects your hands and forearms.', icon: 'plate-gloves' },
            { name: 'Belt', price: 15, description: 'Holds your pants up.', icon: 'leather-belt' },
            { name: 'Bracers', price: 25, description: 'Protects your wrists.', icon: 'plate-gloves' },
            { name: 'Greaves', price: 55, description: 'Protects your legs.', icon: 'plate-boots' }
        ];        

        // Create and show the table menu
        this.shopMenu = new ShopMenu(this, items);
        this.shopMenu.show();

        // Add an event listener to the close button of the table menu
        this.shopMenu.onClose = () => {
            if (this.shopMenu.tooltipMenu) {
                this.shopMenu.tooltipMenu.destroy();
                this.shopMenu.tooltipMenu = null;
            }
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
