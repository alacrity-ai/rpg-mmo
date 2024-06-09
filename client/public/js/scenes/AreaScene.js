import Phaser from 'phaser';
import { createHotbar } from '../interface/MenuHotbar.js';
import IconHelper from '../interface/IconHelper.js';
import SoundFXManager from '../audio/SoundFXManager.js';
import InteractiveZoneManager from '../interface/InteractiveZoneManager.js';
import PointLightManager from '../graphics/PointLight.js';
import CustomCursor from '../interface/CustomCursor.js';
import MusicManager from '../audio/MusicManager.js';
import Debug from '../interface/Debug.js';
import { addBackgroundImage } from '../graphics/BackgroundManager.js';
import FogEffect from '../graphics/FogEffect.js';
import AreaNavigationMenu from '../interface/menu/AreaNavigationMenu.js';
import AreaMapMenu from '../interface/menu/AreaMapMenu.js';
import EncounterPromptMenu from '../interface/menu/EncounterPromptMenu.js';
import PartyDisplayMenu from '../interface/menu/PartyDisplayMenu.js'

/* ExpeditionScene.js
 * Base class for all Expedition Area Scenes
 * @param {object} areaData - data for the current area, see models/AreaInstance.js in server code
 */
export default class AreaScene extends Phaser.Scene {
    constructor(key, areaInstanceData, debugMode = false) {
        super({ key });
        this.key = key;
        this.areaInstanceData = areaInstanceData;
        this.zoneName = areaInstanceData['zoneName'];
        this.zoneInstanceId = areaInstanceData['zoneInstanceId'];
        this.zoneTemplateId = areaInstanceData['zoneTemplateId'];
        this.backgroundImage = areaInstanceData['backgroundImage'];
        this.musicPath = areaInstanceData['musicPath'];
        this.ambientSoundPath = areaInstanceData['ambientSoundPath'];
        this.areaConnections = areaInstanceData['areaConnections'];
        this.debugMode = debugMode;
    }

    preload() {
        this.load.image(this.backgroundImage, this.backgroundImage);
        if (this.musicPath) {
            this.load.audio(this.musicPath, this.musicPath);
        }
        if (this.ambientSoundPath) {
            this.load.audio(this.ambientSoundPath, this.ambientSoundPath);
        }
    }

    create() {
        console.log('Running create event for ExpeditionScene');
        // Play Background Music
        if (this.musicPath) {
            MusicManager.playMusic(this.musicPath);
        }

        // Play Ambient Sound
        if (this.ambientSoundPath) {
            MusicManager.playAmbient(this.ambientSoundPath);
        }

        // Initialize SoundFXManager
        SoundFXManager.initialize(this);

        // Add the background image and ensure it fits the canvas
        addBackgroundImage(this, this.backgroundImage, this.sys.game.config.width, this.sys.game.config.height);

        // Initialize the IconHelper
        this.iconHelper = new IconHelper(this, 'icons');
        createHotbar(this, this.iconHelper);

        // Initialize the party display menu
        this.partyDisplayMenu = new PartyDisplayMenu(this);

        // Initialize the InteractiveZoneManager
        this.interactiveZoneManager = new InteractiveZoneManager(this);

        // Initialize the CustomCursor
        CustomCursor.getInstance(this);

        // Add the fog effect
        const fogData = this.areaInstanceData.environmentEffects?.fog;
        if (fogData) {
            this.fogEffect = new FogEffect(this, 1, fogData.intensity, fogData.speed, 0);
        }

        // Initialize PointLightManager
        this.pointLightManager = new PointLightManager(this);

        // Initialize the AreaNavigationMenu
        this.areaNavigationMenu = new AreaNavigationMenu(this, this.areaInstanceData.id);
        this.areaNavigationMenu.setupAreaNavigationButtons(this.areaConnections);

        // Initialize the AreaMapMenu
        this.areaMapMenu = new AreaMapMenu(this, 920, 80, 0.5); // Adjust the position as needed
        this.updateRegistryWithAreaConnections();
        const areaConnections = this.registry.get('areaConnections');
        this.areaMapMenu.setupAreaMap(areaConnections, this.areaInstanceData.id);

        // Check for an encounter
        if (this.areaInstanceData.encounter) {
            this.encounterPromptMenu = new EncounterPromptMenu(this, this.areaInstanceData.id);
        }

        // Initialize the Debug class
        if (this.debugMode) {
            this.debug = new Debug(this);
        }
    }

    update(time, delta) {
        // Update point lights with delta time
        this.pointLightManager.update(delta);

        // Update fog effect if exists
        if (this.fogEffect) {
            this.fogEffect.update(time, delta);
        }

        // Update debug coordinates
        if (this.debugMode) {
            this.debug.update(this.input.activePointer);
        }
    }

    updateRegistryWithAreaConnections() {
        const areaId = this.areaInstanceData.id;
        const areaConnections = this.areaInstanceData.areaConnections;

        // Get the current registry data or initialize if it doesn't exist
        let currentConnections = this.registry.get('areaConnections') || {};

        // Update the registry with the new area connections
        currentConnections[areaId] = areaConnections;
        this.registry.set('areaConnections', currentConnections);

        console.log('Updated registry with area connections:', currentConnections);
    }

    cleanup() {
        if (this.ambientSoundPath !== null) MusicManager.stopAmbient();
        // Delete this scene key from the phaser game
        console.log('Removing scene key:', this.key);
        this.scene.remove(this.key);
    }
}
