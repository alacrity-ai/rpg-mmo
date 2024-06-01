import Phaser from 'phaser';
import { createHotbar } from '../../interface/MenuHotbar.js';
import PartyDisplayManager from '../../interface/PartyDisplayManager.js';
import IconHelper from '../../interface/IconHelper.js';
import TutorialMenu from '../../interface/menu/TutorialMenu.js';
import DialogueMenu from '../../interface/menu/DialogueMenu.js';
import LoginMenu from '../../interface/menu/LoginMenu.js';
import ShopMenu from '../../interface/menu/ShopMenu.js';
import ErrorMenu from '../../interface/menu/ErrorMenu.js';
import TownNavigationMenu from '../../interface/menu/TownNavigationMenu.js';
import AreaMapMenu from '../../interface/menu/AreaMapMenu.js';
import api from '../../api'

export default class MenuTestScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuTestScene' });
    }

    preload() {
        // Preload necessary assets here if any
        this.load.image('background', 'assets/images/zones/forest-1/1-1.png');

        // Example party data
        this.party = [
            { frameCount: 20, prefix: 'priest', maxHealth: 80, maxMana: 100 },
            { frameCount: 20, prefix: 'mage', maxHealth: 70, maxMana: 120 },
            { frameCount: 20, prefix: 'knight', maxHealth: 120, maxMana: 40 },
            { frameCount: 20, prefix: 'rogue', maxHealth: 90, maxMana: 60 }
        ];
    }

    create() {
        // Add the background image and ensure it fits the canvas
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0);

        // Initialize PartyDisplayManager
        this.partyDisplayManager = new PartyDisplayManager(this, this.party);

        // Initialize the IconHelper
        this.iconHelper = new IconHelper(this, 'icons');
        createHotbar(this, this.iconHelper);

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
        this.areaMapMenu = new AreaMapMenu(this, this.sys.game.config.width / 8, this.sys.game.config.height / 2.5);
        this.areaMapMenu.setupAreaMap(areaData, 1, false);

        // Create and show the navigation menu
        const navigationData = areaData['1'];
        this.navigationMenu = new TownNavigationMenu(this, this.sys.game.config.width / 14, this.sys.game.config.height / 1.4);
        this.navigationMenu.setupNavigationButtons(navigationData);
        this.navigationMenu.show();


        this.time.delayedCall(1000, () => {
            // Get the items using our api call
            const shopId = 1;
            api.shop.viewShopInventory(shopId).then(items => {
                // Create and show the shop menu with the fetched items
                console.log('Fetching shop inventory');
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
                }).catch(error => {
                    console.error('Failed to fetch shop inventory:', error);
                    // Handle error, e.g., show an error message to the player
                });

        });
    }

    update(time, delta) {
        // Update logic here if needed
    }
}
