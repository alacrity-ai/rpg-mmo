import Phaser from 'phaser';
import CircleMaskImagePlugin from 'phaser3-rex-plugins/plugins/circlemaskimage-plugin.js';

import TownScene from './scenes/town/eldergrove/TownScene.js';
import MenuTestScene from './scenes/dev_scenes/MenuTestScene.js';
import ArcaniumScene from './scenes/town/eldergrove/ArcaniumScene.js';
import BlacksmithScene from './scenes/town/eldergrove/BlacksmithScene.js';
import GuildhallScene from './scenes/town/eldergrove/GuildhallScene.js';
import MapScene from './scenes/town/eldergrove/MapScene.js';
import MarketScene from './scenes/town/eldergrove/MarketScene.js';
import ExpeditionScene from './scenes/ExpeditionScene.js';
import CombatScene from './scenes/CombatScene.js';
import LoginScene from './scenes/LoginScene.js';
import PreloaderScene from './scenes/PreloaderScene.js';

import socketManager from './SocketManager.js';


// Configuration for the Phaser game
const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 562,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'phaser-game',
    },
    scene: [
        PreloaderScene,
        TownScene,
        MenuTestScene,
        ExpeditionScene,
        CombatScene,
        ArcaniumScene,
        BlacksmithScene,
        GuildhallScene,
        MarketScene,
        MapScene,
        LoginScene
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
    },
    pixelArt: false, // Ensures pixel art is rendered without smoothing
};

// Connect to the server using the URL from .env
const url = import.meta.env.VITE_SERVER_URL;
console.log(`Server URL: ${url}`);

socketManager.connect(url).then(() => {
    console.log('Socket connected, starting Phaser game...');
    // Create a new Phaser game instance after the socket connection is established
    const game = new Phaser.Game(config);
  }).catch((err) => {
    console.error('Failed to connect to the server, cannot start the game.', err);
  });
