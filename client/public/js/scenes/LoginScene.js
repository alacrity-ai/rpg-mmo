import Phaser from 'phaser';
import LoginMenu from '../interface/menu/LoginMenu.js';
import MusicManager from '../audio/MusicManager.js';
import SoundFXManager from '../audio/SoundFXManager.js';
import CustomCursor from '../interface/CustomCursor.js';
import { addBackgroundImage } from '../graphics/BackgroundManager.js';

export default class LoginScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoginScene' });
    }

    preload() {
        this.load.image('background', 'assets/images/menu/menu_1.png');
        this.load.audio('background-music-menu', 'assets/music/battle_music.mp3');
    }

    create() {
        addBackgroundImage(this, 'background', this.sys.game.config.width, this.sys.game.config.height);

        this.loginMenu = new LoginMenu(this);
        this.loginMenu.show();

        // Initialize the music manager
        MusicManager.playMusic('background-music-menu');

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
