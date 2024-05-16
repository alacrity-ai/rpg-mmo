import Phaser from 'phaser';
import CircleMaskImagePlugin from 'phaser3-rex-plugins/plugins/circlemaskimage-plugin.js';
import IconHelper from './interface/IconHelper.js';
import { createHotbar } from './interface/MenuHotbar.js';
import MusicManager from './audio/MusicManager.js';
import SoundFXManager from './audio/SoundFXManager.js';

// Configuration for the Phaser game
const config = {
    type: Phaser.AUTO,
    width: 1050,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    plugins: {
        global: [{
            key: 'rexCircleMaskImagePlugin',
            plugin: CircleMaskImagePlugin,
            start: true
        }]
    },
    audio: {
        disableWebAudio: false
    }
};

// Create a new Phaser game instance
const game = new Phaser.Game(config);

let iconHelper;
let soundFXManager;
let customCursor;
let cursorClicked;

function preload() {
    // Load the images
    this.load.image('background', 'assets/images/zones/z1-1-forest.png');
    this.load.spritesheet('icons', 'assets/images/ui/iconsheet1.png', {
        frameWidth: 32,
        frameHeight: 32
    });

    // Load the audio
    this.load.audio('background-music', 'assets/music/forest-1.mp3');

    // Load the cursor images
    this.load.image('cursor', 'assets/images/ui/cursor.png');
    this.load.image('cursor_clicked', 'assets/images/ui/cursor_clicked.png');
}

function create() {
    // Add the background image
    this.add.image(400, 300, 'background');

    // Initialize the music manager
    this.musicManager = new MusicManager(this);

    // Initialize the SFX Manager
    soundFXManager = new SoundFXManager(this);

    // Play background music
    this.musicManager.playMusic('background-music');

    // Initialize the IconHelper
    iconHelper = new IconHelper(this, 'icons');
    createHotbar(this, iconHelper, soundFXManager);

    // Hide the default cursor
    this.input.setDefaultCursor('none');

    // Add custom cursors with top-left origin
    customCursor = this.add.image(this.input.activePointer.x, this.input.activePointer.y, 'cursor').setDepth(1000).setOrigin(0, 0);
    cursorClicked = this.add.image(this.input.activePointer.x, this.input.activePointer.y, 'cursor_clicked').setDepth(1000).setOrigin(0, 0).setVisible(false);

    // Update cursor position on pointer move
    this.input.on('pointermove', pointer => {
        customCursor.setPosition(pointer.x, pointer.y);
        cursorClicked.setPosition(pointer.x, pointer.y);
    });

    // Change cursor image on pointer down and up
    this.input.on('pointerdown', () => {
        customCursor.setVisible(false);
        cursorClicked.setVisible(true);
    });

    this.input.on('pointerup', () => {
        customCursor.setVisible(true);
        cursorClicked.setVisible(false);
    });
}

function update() {
    // Update custom cursor position to follow the pointer
    customCursor.setPosition(this.input.activePointer.x, this.input.activePointer.y);
    cursorClicked.setPosition(this.input.activePointer.x, this.input.activePointer.y);
}
