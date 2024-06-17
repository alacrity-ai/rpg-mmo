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
import PartyDisplayMenu from '../interface/menu/PartyDisplayMenu.js';

// Test scene data
const testSceneData = {
  "name": "AreaSceneTest",
  "connections": {
    "north": "scene2",
    "south": null,
    "east": null,
    "west": null
  },
  "background": "assets/images/zone/area/normal/elderswood/area_11.png",
  "lightSources": [
    {
      "x": 542.6666259765625,
      "y": 58.999996185302734,
      "color": "#ffff00",
      "radius": 50,
      "intensity": 0.1,
      "pulsate": true,
      "minIntensity": 0.3,
      "maxIntensity": 0.7
    },
    {
      "x": 592.6666259765625,
      "y": 232.99999618530273,
      "color": "#ffff00",
      "radius": 50,
      "intensity": 0.1,
      "pulsate": true,
      "minIntensity": 0.3,
      "maxIntensity": 0.7
    }
  ],
  "encounters": [
    {
      "name": "Forest Ambush",
      "probability": 1
    }
  ],
  "weather": {
    "fog": true,
    "fogBrightness": 0.5,
    "fogThickness": 0.5,
    "fogSpeed": 1.5
  },
  "audio": {
    "music": "assets/music/zones/elderswood.mp3",
    "ambientSound": "assets/sounds/ambient/arcanium.wav"
  },
  "npcs": [
    {
      "x": 400.6666259765625,
      "y": 466.99999618530273,
      "path": "http://localhost:8002/assets/images/npcs/forest_hunter_female_old/editor.png",
      "scale": 1,
      "flipped": false,
      "dialogue": null,
      "dialogueFilename": null,
      "name": "",
      "atlasPath": "assets/images/npcs/forest_hunter_female_old"
    }
  ],
  "entrances": [
    {
      "x1": 542.6666259765625,
      "y1": 309.99999618530273,
      "x2": 658.6666259765625,
      "y2": 402.99999618530273,
      "sceneKey": "scene2",
      "oneWay": false
    }
  ]
};

/* ExpeditionScene.js
 * Base class for all Expedition Area Scenes
 * @param {object} areaData - data for the current area, see models/AreaInstance.js in server code
 */
export default class AreaSceneTest extends Phaser.Scene {
    constructor(sceneData = testSceneData, debugMode = false) {
        const key = sceneData.name; // Determine key from data.name
        super({ key });
        this.key = key;
        this.sceneData = sceneData;
        this.debugMode = debugMode;

        // Destructuring the sceneData object for easy access
        this.backgroundImage = sceneData.background;
        this.musicPath = sceneData.audio?.music;
        this.ambientSoundPath = sceneData.audio?.ambientSound;
        this.areaConnections = sceneData.connections;
        this.lightSources = sceneData.lightSources;
        this.fogData = sceneData.weather?.fog ? {
            intensity: sceneData.weather.fogBrightness,
            thickness: sceneData.weather.fogThickness,
            speed: sceneData.weather.fogSpeed
        } : null;
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
        if (this.fogData) {
            this.fogEffect = new FogEffect(this, 1, this.fogData.intensity, this.fogData.speed, 0);
        }

        // Initialize PointLightManager and add lights from the scene data
        this.pointLightManager = new PointLightManager(this);
        if (this.lightSources) {
            this.lightSources.forEach(light => {
                this.pointLightManager.addPointLight(light.x, light.y, Phaser.Display.Color.HexStringToColor(light.color).color, light.radius, light.intensity, light.pulsate, light.minIntensity, light.maxIntensity);
            });
        }

        // Initialize the AreaNavigationMenu
        this.areaNavigationMenu = new AreaNavigationMenu(this, this.sceneData.name);
        this.areaNavigationMenu.setupAreaNavigationButtons(this.areaConnections);

        // Initialize the AreaMapMenu
        this.areaMapMenu = new AreaMapMenu(this, 920, 80, 0.5); // Adjust the position as needed
        this.updateRegistryWithAreaConnections();
        const areaConnections = this.registry.get('areaConnections');
        this.areaMapMenu.setupAreaMap(areaConnections, this.sceneData.name);

        // Check for an encounter
        if (this.sceneData.encounters && this.sceneData.encounters.length > 0) {
            this.encounterPromptMenu = new EncounterPromptMenu(this, this.sceneData.name);
        }

        // Initialize the Debug class
        if (this.debugMode) {
            this.debug = new Debug(this);
        }

        // Stubs for implementing NPCs
        this.sceneData.npcs.forEach(npc => {
            // Add logic for NPCs here
        });

        // Stubs for implementing entrances
        this.sceneData.entrances.forEach(entrance => {
            // Add logic for entrances here
        });
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
        const areaId = this.sceneData.name;
        const areaConnections = this.areaConnections;

        // Get the current registry data or initialize if it doesn't exist
        let currentConnections = this.registry.get('areaConnections') || {};

        // Update the registry with the new area connections
        currentConnections[areaId] = areaConnections;
        this.registry.set('areaConnections', currentConnections);
        this.registry.set('currentAreaId', areaId);
        console.log('Updated registry with area connections:', currentConnections);
    }

    cleanup() {
        if (this.ambientSoundPath !== null) MusicManager.stopAmbient();
        // Delete this scene key from the phaser game
        console.log('Removing scene key:', this.key);
        this.scene.remove(this.key);
    }
}
