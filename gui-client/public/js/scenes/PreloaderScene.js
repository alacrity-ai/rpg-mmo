// PreloaderScene.js
import Phaser from 'phaser';
import SoundFXManager from '../audio/SoundFXManager.js';
import MusicManager from '../audio/MusicManager.js';

export default class PreloaderScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloaderScene' });
    }

    preload() {
        // Load the icons sprite sheet
        this.load.spritesheet('icons', 'assets/images/ui/iconsheet1.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        // Initialize the SFX Manager
        SoundFXManager.initialize(this);
        SoundFXManager.preloadSounds([
            'assets/sounds/door_open.wav',
            'assets/sounds/door_close.wav',
            'assets/sounds/menu/menu_highlight.wav',
            'assets/sounds/menu/book_open.wav',
            'assets/sounds/menu/bag_open.wav',
            'assets/sounds/menu/chat_menu.wav',
            'assets/sounds/menu/tent_open.wav',
        ]);

        
    }

    create() {
        // Initialize the SFX Manager
        SoundFXManager.onPreloadComplete();
        
        // Initialize the MusicManager
        MusicManager.initialize(this);

        // Start the main scene
        this.scene.start('TownScene'); // or whichever scene you want to start with
    }
}
