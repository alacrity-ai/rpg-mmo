import Phaser from 'phaser';
import LoginMenu from '../interface/menu/LoginMenu.js';
import MusicManager from '../audio/MusicManager.js';
import SoundFXManager from '../audio/SoundFXManager.js';
import CustomCursor from '../interface/CustomCursor.js';

export default class LoginScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoginScene' });
    }

    preload() {
        this.load.image('background', 'assets/images/zones/forest-1/1-7.png');
        this.load.audio('background-music', 'assets/music/forest-1.mp3');
    }

    create() {
        // Add the background image and ensure it fits the canvas
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

        this.loginMenu = new LoginMenu(this);
        this.loginMenu.show();

        // Initialize the music manager
        MusicManager.playMusic('background-music');

        // Initialize SoundFXManager
        SoundFXManager.initialize(this);

        // Get CustomCursor instance
        CustomCursor.getInstance(this);
    }

    update(time, delta) {
        // Update custom cursor position
        CustomCursor.getInstance(this).update();
    }

    cleanup() {
        this.textures.removeKey('background');
    }
}
