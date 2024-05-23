import Phaser from 'phaser';
import TutorialMenu from '../../interface/menu/TutorialMenu.js';
import DialogueMenu from '../../interface/menu/DialogueMenu.js';
import LoginMenu from '../../interface/menu/LoginMenu.js';
import ShopMenu from '../../interface/menu/ShopMenu.js';
import ErrorMenu from '../../interface/menu/ErrorMenu.js';
import NavigationMenu from '../../interface/menu/NavigationMenu.js';
import AreaMapMenu from '../../interface/menu/AreaMapMenu.js';

export default class MenuTestScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuTestScene' });
    }

    preload() {
        // Preload necessary assets here if any
        this.load.image('background', 'assets/images/zones/forest-1/1-1.png');
    }

    create() {
        // Add the background image and ensure it fits the canvas
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
        const areaData = {
            '1': { north: null, south: 4, east: 2, west: null, type: 'entrance' },
            '2': { north: null, south: 3, east: null, west: 1, type: 'area' },
            '3': { north: 2, south: null, east: null, west: 4, type: 'area' },
            '4': { north: 1, south: 5, east: 3, west: null, type: 'area' },
            '5': { north: 4, south: 6, east: null, west: null, type: 'area' },
            '6': { north: 5, south: 7, east: null, west: null, type: 'area' },
            '7': { north: 6, south: null, east: 8, west: null, type: 'area' },
            '8': { north: null, south: null, east: 9, west: 7, type: 'area' },
            '9': { north: null, south: null, east: 10, west: 8, type: 'area' },
            '10': { north: null, south: null, east: 11, west: 9, type: 'area' },
            '11': { north: null, south: null, east: null, west: 10, type: 'exit' }
        }
        this.areaMapMenu = new AreaMapMenu(this, this.sys.game.config.width / 1.175, this.sys.game.config.height / 1.3);
        this.areaMapMenu.setupAreaMap(areaData, 1, false);

        // Create and show the navigation menu
        const navigationData = areaData['1'];
        this.navigationMenu = new NavigationMenu(this, this.sys.game.config.width / 1.5, this.sys.game.config.height / 1.15);
        this.navigationMenu.setupNavigationButtons(navigationData);
        this.navigationMenu.show();

        // Add an event listener to the close button of the navigation menu
        this.navigationMenu.onClose = () => {
            this.time.delayedCall(1000, () => {
                // Define some items for the shop menu
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

                // Create and show the shop menu
                this.shopMenu = new ShopMenu(this, items);
                this.shopMenu.show();

                // Add an event listener to the close button of the shop menu
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
            });
        };
    }

    update(time, delta) {
        // Update logic here if needed
    }
}
