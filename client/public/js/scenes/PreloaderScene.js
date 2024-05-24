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
        // Attempt to log in regardless of whether createUser succeeded or failed
        // console.log('Attempting to log in')
        // api.auth.login('test', 'test')
        // .then(data => {
        //     console.log('User logged in successfully:', data);
        // })
        // .catch(error => {
        //     console.error('Error logging in', error);
        // })

        api.auth.createUser('test4', 'test4')
        .then(data => {
            console.log('Account created successfully', data);
        })
        .catch(error => {
            console.error('Error creating account', error);
        })

        // api.auth.createUser('test', 'test')
        // .then(data => {
        //     console.log('User created successfully:', data);
        // })
        // .catch(error => {
        //     console.error('Error creating user:', error);
        // })
        // .finally(() => {
        //     // Attempt to log in regardless of whether createUser succeeded or failed
        //     api.auth.login('test', 'test')
        //     .then(data => {
        //         console.log('User logged in successfully:', data);
        //         // After logging in, create a character
        //         return api.character.createCharacter('joe', 'arcanist');
        //     })
        //     .catch(error => {
        //         console.error('Error creating character:', error);
        //     })
        //     .finally(() => {
        //         // Attempt to character login regardless of whether createCharacter succeeded or failed
        //         api.character.characterLogin('joe')
        //         .then(data => {
        //             console.log('Character logged in successfully:', data);
        //             // Add any additional logic you want to execute after character login
        //         })
        //         .catch(error => {
        //             console.error('Error logging in character:', error);
        //             // Handle error, maybe show a message to the user
        //         });
        //     });
        // });

        // Initialize the SFX Manager
        SoundFXManager.onPreloadComplete();
        
        // Initialize the MusicManager
        MusicManager.initialize(this);

        // // Start the main scene
        this.scene.start('MenuTestScene'); 
    }
}
