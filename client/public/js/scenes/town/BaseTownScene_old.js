import Phaser from 'phaser';
import { createHotbar } from '../../interface/MenuHotbar.js';
import IconHelper from '../../interface/IconHelper.js';
import SoundFXManager from '../../audio/SoundFXManager.js';
import InteractiveZoneManager from '../../interface/InteractiveZoneManager.js';
import CustomCursor from '../../interface/CustomCursor.js';
import MusicManager from '../../audio/MusicManager.js';
import Debug from '../../interface/Debug.js';
import { addBackgroundImage } from '../../graphics/BackgroundManager.js';

export default class BaseTownScene extends Phaser.Scene {
    constructor(key, backgroundKey, musicKey = 'background-music') {
        super({ key });
        this.backgroundKey = backgroundKey;
        this.musicKey = musicKey;
    }

    preload() {
        this.load.image(this.backgroundKey, `assets/images/zone/town/${this.backgroundKey}.png`);
    }

    create() {
        // Add the background image and ensure it fits the canvas
        addBackgroundImage(this, this.backgroundKey, this.sys.game.config.width, this.sys.game.config.height);

        // Initialize the IconHelper
        this.iconHelper = new IconHelper(this, 'icons');
        createHotbar(this, this.iconHelper);

        // Initialize the InteractiveZoneManager
        this.interactiveZoneManager = new InteractiveZoneManager(this);

        // Initializ the CustomCursor
        CustomCursor.getInstance(this);

        // Add the arrow-down-red icon to the bottom right of the screen
        const arrowDownRedIcon = this.iconHelper.getIcon('arrow-down-red');
        const { width, height } = this.sys.game.config;

        // Position the icon at the bottom right
        arrowDownRedIcon.setPosition(width - 60, 530); // Adjust as needed for padding

        // Add an event listener to switch back to TownScene
        arrowDownRedIcon.setInteractive();
        arrowDownRedIcon.on('pointerdown', () => {
            SoundFXManager.playSound('assets/sounds/door_close.wav');
            MusicManager.stopAmbient();
            this.scene.start('TownScene');
        });

        // Initialize the Debug class
        this.debug = new Debug(this);
    }

    update(time, delta) {
        // Update custom cursor position
        CustomCursor.getInstance(this).update();

        // Update debug coordinates
        this.debug.update(this.input.activePointer);
    }
}