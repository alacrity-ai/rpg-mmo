import Phaser from 'phaser';
import TownScene from './scenes/TownScene.js';
import ExpeditionScene from './scenes/ExpeditionScene.js';
import CombatScene from './scenes/CombatScene.js';
import CircleMaskImagePlugin from 'phaser3-rex-plugins/plugins/circlemaskimage-plugin.js';


// Configuration for the Phaser game
const config = {
    type: Phaser.AUTO,
    width: 1050,
    height: 600,
    scene: [TownScene, ExpeditionScene, CombatScene],
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
