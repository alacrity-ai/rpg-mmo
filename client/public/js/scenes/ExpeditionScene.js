import Phaser from 'phaser';
import { createHotbar } from '../interface/MenuHotbar.js';
import IconHelper from '../interface/IconHelper.js';
import PartyDisplayManager from '../interface/PartyDisplayManager.js';
import SoundFXManager from '../audio/SoundFXManager.js';
import InteractiveZoneManager from '../interface/InteractiveZoneManager.js';
import PointLightManager from '../graphics/PointLight.js';
import CustomCursor from '../interface/CustomCursor.js';
import MusicManager from '../audio/MusicManager.js';
import NavigationMenu from '../interface/menu/NavigationMenu.js'
import Debug from '../interface/Debug.js';
import { addBackgroundImage } from '../graphics/BackgroundManager.js';
import { fadeTransition } from './utils/SceneTransitions.js';

/* ExpeditionScene.js
 * Base class for all Expedition Area Scenes
 * @param {object} areaData - data for the current area, see models/AreaInstance.js in server code
 */
export default class ExpeditionScene extends Phaser.Scene {
    constructor(areaInstanceData = {}, zoneInstanceData = {}) {
        super({ key: 'ExpeditionScene' });
        this.areaInstanceData = areaInstanceData;
        this.zoneName = areaInstanceData['zoneName'];
        this.zoneInstanceId = areaInstanceData['zoneInstanceId'];
        this.zoneTemplateId = areaInstanceData['zoneTemplateId'];
        this.backgroundImage = areaInstanceData['backgroundImage'];
        this.musicPath = areaInstanceData['musicPath'];
        this.ambientSoundPath = areaInstanceData['ambientSoundPath'];
        this.areaConnections = areaInstanceData['areaConnections'];
        this.zoneInstanceData = zoneInstanceData;
        this.areaConnections = zoneInstanceData['areas'][areaInstanceData.id];
    }

    preload() {
        // Example party data (Replace this with API call to get party data)
        this.party = [
            { frameCount: 20, prefix: 'priest', maxHealth: 80, maxMana: 100 },
            // { frameCount: 20, prefix: 'mage', maxHealth: 70, maxMana: 120 },
            // { frameCount: 20, prefix: 'knight', maxHealth: 120, maxMana: 40 },
            // { frameCount: 20, prefix: 'rogue', maxHealth: 90, maxMana: 60 }
        ];

        this.load.image(this.backgroundImagePath, `assets/images/zone/town/${this.backgroundImagePath}`);
        if (this.backgroundMusicPath !== null) {
            this.load.audio(this.backgroundMusicPath, `assets/music/${this.backgroundMusicPath}`);
        }
        if (this.ambientSoundPath !== null) {
            this.load.audio(this.ambientSoundPath, `assets/sounds/ambient/${this.ambientSoundPath}`);
        }
    }

    create() {
        // Play Background Music
        if (this.backgroundMusicPath !== null) {
            MusicManager.playMusic(this.backgroundMusicPath);
        };

        // Play Ambient Sound
        if (this.ambientSoundPath !== null) {
            MusicManager.playAmbient(this.ambientSoundPath);
        };

        // Initialize SoundFXManager
        SoundFXManager.initialize(this);

        // Add the background image and ensure it fits the canvas
        addBackgroundImage(this, this.backgroundImagePath, this.sys.game.config.width, this.sys.game.config.height);

        // Initialize the IconHelper
        this.iconHelper = new IconHelper(this, 'icons');
        createHotbar(this, this.iconHelper);

        // Initalize the Party Display Manager
        this.partyDisplayManager = new PartyDisplayManager(this, this.party);

        // Initialize the Navigation Menu
        // Correct the below if statement because This condition will always return 'true' since JavaScript compares objects by reference, not value
        if (Object.keys(this.navigationMenuScenes).length > 0) {
            this.navigationMenu = new NavigationMenu(this);
            this.navigationMenu.setupTownNavigationButtons(this.navigationMenuScenes.up, this.navigationMenuScenes.down, this.navigationMenuScenes.left, this.navigationMenuScenes.right);
            this.navigationMenu.show();
        }

        // Initialize the InteractiveZoneManager
        this.interactiveZoneManager = new InteractiveZoneManager(this);

        // Initializ the CustomCursor
        CustomCursor.getInstance(this);

        // Add an event listener to switch back to TownScene
        if (this.returnSceneKey !== null) {
            this.addReturnButton();
        };

        // Initialize PointLightManager
        this.pointLightManager = new PointLightManager(this);

        // Initialize the Debug class
        this.debug = new Debug(this);
    }

    update(time, delta) {
        // Update custom cursor position
        CustomCursor.getInstance(this).update();

        // Update point lights with delta time
        this.pointLightManager.update(delta);

        // Update fog effect if exists
        if (this.fogEffect) {
            this.fogEffect.update(time, delta);
        }

        // Update debug coordinates
        this.debug.update(this.input.activePointer);
    }

    addReturnButton() {
        // Add the arrow-down-red icon to the bottom right of the screen
        const arrowDownRedIcon = this.iconHelper.getIcon('arrow-down-red');
        const { width, height } = this.sys.game.config;

        // Position the icon at the bottom right
        arrowDownRedIcon.setPosition(width - 60, 530); // Adjust as needed for padding
        arrowDownRedIcon.setInteractive();

        arrowDownRedIcon.on('pointerdown', () => {
            SoundFXManager.playSound('assets/sounds/door_close.wav');
            fadeTransition(this, this.returnSceneKey, 500);
        });
    }

    cleanup() {
        if (this.ambientSoundPath !== null) MusicManager.stopAmbient();
    }
}
