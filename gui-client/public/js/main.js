import Phaser from 'phaser';
import TownScene from './scenes/TownScene.js';
import TestScene from './scenes/dev_scenes/MenuTestScene.js';
import ArcaniumScene from './scenes/town_areas/ArcaniumScene.js';
import BlacksmithScene from './scenes/town_areas/BlacksmithScene.js';
import GuildhallScene from './scenes/town_areas/GuildhallScene.js';
import MapScene from './scenes/town_areas/MapScene.js';
import MarketScene from './scenes/town_areas/MarketScene.js';
import ExpeditionScene from './scenes/ExpeditionScene.js';
import CombatScene from './scenes/CombatScene.js';
import CircleMaskImagePlugin from 'phaser3-rex-plugins/plugins/circlemaskimage-plugin.js';
import PreloaderScene from './scenes/PreloaderScene.js';


// Configuration for the Phaser game
const config = {
    type: Phaser.AUTO,
    width: 1050,
    height: 600,
    scene: [
        PreloaderScene,
        TownScene,
        TestScene,
        ExpeditionScene,
        CombatScene,
        ArcaniumScene,
        BlacksmithScene,
        GuildhallScene,
        MarketScene,
        MapScene
    ],
    plugins: {
        global: [{
            key: 'rexCircleMaskImagePlugin',
            plugin: CircleMaskImagePlugin,
            start: true
        }]
    },
    audio: {
        disableWebAudio: false
    }
};

// Create a new Phaser game instance
const game = new Phaser.Game(config);
