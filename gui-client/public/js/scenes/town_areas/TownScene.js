import Phaser from 'phaser';
import { createHotbar } from '../../interface/MenuHotbar.js';
import IconHelper from '../../interface/IconHelper.js';
import SoundFXManager from '../../audio/SoundFXManager.js';
import MusicManager from '../../audio/MusicManager.js';
import Debug from '../../interface/Debug.js';
import InteractiveZoneManager from '../../interface/InteractiveZoneManager.js';
import CustomCursor from '../../interface/CustomCursor.js';
import PointLightManager from '../../graphics/PointLight.js';
import PartyDisplayManager from '../../interface/PartyDisplayManager.js';
import socketManager from '../../SocketManager.js';

export default class TownScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TownScene' });
    }

    preload() {
        this.load.image('background', 'assets/images/zones/town-1/town.png');

        // Initialize the Music Manager
        this.load.audio('background-music', 'assets/music/forest-1.mp3');
        this.load.audio('background-blacksmith', 'assets/sounds/ambient/blacksmith.wav');
        this.load.audio('background-market', 'assets/sounds/ambient/market.wav');
        this.load.audio('background-guildhall', 'assets/sounds/ambient/guildhall.wav')
        this.load.audio('background-arcanium', 'assets/sounds/ambient/arcanium.wav');

        // Initialize the CustomCursor (preload assets)
        this.customCursor = new CustomCursor(this);

        // Example party data
        this.party = [
            { frameCount: 20, prefix: 'priest', maxHealth: 80, maxMana: 100 },
            { frameCount: 20, prefix: 'mage', maxHealth: 70, maxMana: 120 },
            { frameCount: 20, prefix: 'knight', maxHealth: 120, maxMana: 40 },
            { frameCount: 20, prefix: 'rogue', maxHealth: 90, maxMana: 60 }
        ];
    }

    create() {
        // Play background music
        MusicManager.playMusic('background-music');

        // Initialize SoundFXManager
        SoundFXManager.initialize(this);

        // Add the background image and ensure it fits the canvas
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

        // Initialize PartyDisplayManager
        this.partyDisplayManager = new PartyDisplayManager(this, this.party);

        // Initialize the IconHelper
        this.iconHelper = new IconHelper(this, 'icons');
        createHotbar(this, this.iconHelper);

        // Initialize the InteractiveZoneManager
        this.interactiveZoneManager = new InteractiveZoneManager(this);

        this.interactiveZoneManager.createInteractiveArea(150, 360, 200, 150, 'Market', () => {
            SoundFXManager.playSound('assets/sounds/door_open.wav');
            MusicManager.playAmbient('background-market');
            this.scene.start('MarketScene');
        });

        this.interactiveZoneManager.createInteractiveArea(400, 330, 80, 100, 'Arcanium', () => {
            SoundFXManager.playSound('assets/sounds/door_open.wav');
            MusicManager.playAmbient('background-arcanium');
            this.scene.start('ArcaniumScene');
        });

        this.interactiveZoneManager.createInteractiveArea(515, 300, 150, 150, 'Blacksmith', () => {
            SoundFXManager.playSound('assets/sounds/door_open.wav');
            MusicManager.playAmbient('background-blacksmith');
            this.scene.start('BlacksmithScene');
        });

        this.interactiveZoneManager.createInteractiveArea(780, 360, 150, 150, 'Guild Hall', () => {
            SoundFXManager.playSound('assets/sounds/door_open.wav');
            MusicManager.playAmbient('background-guildhall');
            this.scene.start('GuildhallScene');
        });

        // Initialize the Debug class
        this.debug = new Debug(this);

        // Add pulsating point lights
        this.pointLightManager = new PointLightManager(this);
        this.pointLightManager.addPointLight(539, 380, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.004);
        this.pointLightManager.addPointLight(643, 380, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.006);
        this.pointLightManager.addPointLight(347.5, 466, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.003); 
    }

    update(time, delta) {
        // Update custom cursor position
        this.customCursor.update();

        // Update point lights with delta time
        this.pointLightManager.update(delta);

        // Update debug coordinates
        this.debug.update(this.input.activePointer);
    }
}
