import Phaser from 'phaser';
import { createHotbar } from '../../interface/MenuHotbar.js';
import IconHelper from '../../interface/IconHelper.js';
import PartyDisplayManager from '../../interface/PartyDisplayManager.js';
import SoundFXManager from '../../audio/SoundFXManager.js';
import InteractiveZoneManager from '../../interface/InteractiveZoneManager.js';
import PointLightManager from '../../graphics/PointLight.js';
import CustomCursor from '../../interface/CustomCursor.js';
import MusicManager from '../../audio/MusicManager.js';
import TownNavigationMenu from '../../interface/menu/TownNavigationMenu.js';
import Debug from '../../interface/Debug.js';
import { addBackgroundImage } from '../../graphics/BackgroundManager.js';
import { fadeTransition } from '../utils/SceneTransitions.js';

/* BaseTownScene.js
 * Base class for town scenes
 * All town scenes should extend this class
 * @param {string} key - the scene key
 * @param {string} backgroundImagePath - the path to the background image, e.g. 'eldergrove/exterior-1.png'
 * @param {string} backgroundMusicPath - the path to the background music, e.g. 'forest-1.mp3'
 * @param {string} ambientSoundPath - the path to the ambient sound, e.g. 'blacksmith.wav'
 * @param {string} returnSceneKey - the key of the scene to return to
 */
export default class BaseTownScene extends Phaser.Scene {
    constructor(key, backgroundImagePath, backgroundMusicPath = null, ambientSoundPath = null, returnSceneKey = null, navigationMenuScenes = {}) {
        super({ key });
        this.sceneKey = key;
        this.backgroundImagePath = backgroundImagePath;
        this.backgroundMusicPath = backgroundMusicPath;
        this.ambientSoundPath = ambientSoundPath;
        this.returnSceneKey = returnSceneKey;
        this.navigationMenuScenes = navigationMenuScenes;
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
            this.navigationMenu = new TownNavigationMenu(this);
            this.navigationMenu.setupTownNavigationButtons(this.navigationMenuScenes.up, this.navigationMenuScenes.down, this.navigationMenuScenes.left, this.navigationMenuScenes.right);
            this.navigationMenu.show();
        }

        // Initialize the InteractiveZoneManager
        this.interactiveZoneManager = new InteractiveZoneManager(this);

        // Initialize the CustomCursor
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
