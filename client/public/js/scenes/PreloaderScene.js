// PreloaderScene.js
import Phaser from 'phaser';
import SoundFXManager from '../audio/SoundFXManager.js';
import MusicManager from '../audio/MusicManager.js';
import api from '../api'

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
        api.auth.createUser('test', 'test').then((data) => {
            console.log('User created:', data);
        }).catch((error) => {
            console.error('User creation error:', error);
        });

        api.auth.login('test', 'test').then((data) => {
            console.log('Logged in:', data);
        }).catch((error) => {
            console.error('Login error:', error);
        });

        // sleep(5000);

        // api.auth.createCharacter('test', 'mage').then((data) => {
        //     console.log('Character created:', data);
        // }).catch((error) => {
        //     console.error('Character creation error:', error);
        // });

        // api.auth.characterLogin('test').then((data) => {
        //     console.log('Character logged in:', data);
        // }).catch((error) => {
        //     console.error('Character login error:', error);
        // });

        // Initialize the SFX Manager
        SoundFXManager.onPreloadComplete();
        
        // Initialize the MusicManager
        MusicManager.initialize(this);

        // Start the main scene
        this.scene.start('MenuTestScene'); // or whichever scene you want to start with
    }
}
