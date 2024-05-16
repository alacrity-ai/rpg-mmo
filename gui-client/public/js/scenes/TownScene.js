import Phaser from 'phaser';
import { createHotbar } from '../interface/MenuHotbar.js';
import IconHelper from '../interface/IconHelper.js';
import SoundFXManager from '../audio/SoundFXManager.js';
import MusicManager from '../audio/MusicManager.js';
import Debug from '../interface/Debug.js';
import InteractiveZoneManager from '../interface/InteractiveZoneManager.js';
import CustomCursor from '../interface/CustomCursor.js';
import PointLightSource from '../graphics/PointLightSource.js';

export default class TownScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TownScene' });
    }

    preload() {
        this.load.image('background', 'assets/images/zones/town-1/town.png');
        this.load.spritesheet('icons', 'assets/images/ui/iconsheet1.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.audio('background-music', 'assets/music/forest-1.mp3');

        // Initialize the CustomCursor (preload assets)
        this.customCursor = new CustomCursor(this);
    }

    create() {
        // Add the background image and ensure it fits the canvas
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

        // Initialize the music manager
        this.musicManager = new MusicManager(this);

        // Initialize the SFX Manager
        this.soundFXManager = new SoundFXManager(this);

        // Play background music
        this.musicManager.playMusic('background-music');

        // Initialize the IconHelper
        this.iconHelper = new IconHelper(this, 'icons');
        createHotbar(this, this.iconHelper, this.soundFXManager);

        // Initialize the InteractiveZoneManager
        this.interactiveZoneManager = new InteractiveZoneManager(this);

        // Add interactive areas using InteractiveZoneManager
        this.interactiveZoneManager.createInteractiveArea(150, 360, 200, 150, 'Market', () => {
            console.log('Market clicked');
            // Add custom logic for Market here
        });

        this.interactiveZoneManager.createInteractiveArea(400, 330, 80, 100, 'Arcanium', () => {
            console.log('Arcanium clicked');
            // Add custom logic for Mage's Shop here
        });

        this.interactiveZoneManager.createInteractiveArea(515, 300, 150, 150, 'Blacksmith', () => {
            console.log('Blacksmith clicked');
            // Add custom logic for Blacksmith here
        });

        this.interactiveZoneManager.createInteractiveArea(780, 360, 150, 150, 'Guild Hall', () => {
            console.log('Guild Hall clicked');
            // Add custom logic for Guild Hall here
        });

        // Initialize the Debug class
        this.debug = new Debug(this);

        // Add pulsating point lights
        this.pointLight1 = new PointLightSource(this, 539, 380, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.004);
        this.pointLight2 = new PointLightSource(this, 643, 380, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.006);
        this.pointLight3 = new PointLightSource(this, 347.5, 466, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.003);
    }

    update(time, delta) {
        // Update custom cursor position
        this.customCursor.update();

        // Update point lights with delta time
        this.pointLight1.update(delta);
        this.pointLight2.update(delta);
        this.pointLight3.update(delta);

        // Update debug coordinates
        this.debug.update(this.input.activePointer);
    }
}
