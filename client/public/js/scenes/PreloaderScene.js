// PreloaderScene.js
import Phaser from 'phaser';
import SoundFXManager from '../audio/SoundFXManager.js';
import MusicManager from '../audio/MusicManager.js';
import CustomCursor from '../interface/CustomCursor.js';

export default class PreloaderScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloaderScene' });
    }

    preload() {
        // Initialize the CustomCursor (preload assets)
        CustomCursor.init(this);

        // Load the icons sprite sheet
        this.load.spritesheet('icons', 'assets/images/ui/iconsheet1.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        // Initialize the SFX Manager
        SoundFXManager.initialize(this);
        SoundFXManager.preloadSounds([
            'assets/sounds/menu/ui_1.wav',
            'assets/sounds/menu/ui_2.wav',
            'assets/sounds/menu/ui_3.wav',
            'assets/sounds/menu/ui_4.wav',
            'assets/sounds/menu/ui_5.wav',
            'assets/sounds/menu/ui_6.wav',
            'assets/sounds/door_open.wav',
            'assets/sounds/door_open_2.wav',
            'assets/sounds/door_close.wav',
            'assets/sounds/menu/menu_highlight.wav',
            'assets/sounds/menu/book_open.wav',
            'assets/sounds/menu/bag_open.wav',
            'assets/sounds/menu/chat_menu.wav',
            'assets/sounds/menu/tent_open.wav',
            'assets/sounds/footstep_chain.wav'
        ]);
    }

    create() {
        // Get CustomCursor instance
        CustomCursor.getInstance(this);

        // Initialize the SFX Manager
        SoundFXManager.onPreloadComplete();
        
        // Initialize the MusicManager
        MusicManager.initialize(this);

        // Set the first scene of the game after login
        this.registry.set('firstSceneKey', 'TilfordExterior1Scene');

        // Start the Login scene
        this.scene.start('LoginScene'); 
    }
}
