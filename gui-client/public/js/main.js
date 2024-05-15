import Phaser from 'phaser';
import CircleMaskImagePlugin from 'phaser3-rex-plugins/plugins/circlemaskimage-plugin.js';
import TextBox from './interface/TextBox.js';
import IconHelper from './interface/IconHelper.js';
import { createHotbar } from './interface/MenuHotbar.js';

// Configuration for the Phaser game
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
    },
    plugins: {
        global: [{
            key: 'rexCircleMaskImagePlugin',
            plugin: CircleMaskImagePlugin,
            start: true
        }]
    }
};

// Create a new Phaser game instance
const game = new Phaser.Game(config);

let startGame = false;
let iconHelper;

function preload() {
    // Load the images
    this.load.image('background', 'assets/images/zones/z1-1-forest.png');
    this.load.spritesheet('icons', 'assets/images/ui/iconsheet1.png', {
        frameWidth: 32,
        frameHeight: 32
    });
}

function create() {
    // Add the background image
    this.add.image(400, 300, 'background');

    // Initialize the IconHelper
    iconHelper = new IconHelper(this, 'icons');

    // Create the name input text box
    new TextBox(this, 400, 300, 'Enter your name:', (name) => {
        startGame = true;
        createHotbar(this, iconHelper); // Pass the scene and iconHelper to createHotbar
    });
}
