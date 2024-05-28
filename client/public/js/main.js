import Phaser from 'phaser';
import CircleMaskImagePlugin from 'phaser3-rex-plugins/plugins/circlemaskimage-plugin.js';
import socketManager from './SocketManager.js';

// Eldergrove Town Scenes
import EldergroveTownScene from './scenes/town/eldergrove/TownScene.js';
import EldergroveArcaniumScene from './scenes/town/eldergrove/ArcaniumScene.js';
import EldergroveBlacksmithScene from './scenes/town/eldergrove/BlacksmithScene.js';
import EldergroveGuildhallScene from './scenes/town/eldergrove/GuildhallScene.js';
import EldergroveMapScene from './scenes/town/eldergrove/MapScene.js';
import EldergroveMarketScene from './scenes/town/eldergrove/MarketScene.js';

// Tilford Town Scenes
import TilfordExterior1Scene from './scenes/town/tilford/Exterior1Scene.js';
import TilfordExterior2Scene from './scenes/town/tilford/Exterior2Scene.js';
import TilfordExterior3Scene from './scenes/town/tilford/Exterior3Scene.js';

// Game Scenes
import ExpeditionScene from './scenes/ExpeditionScene.js';
import CombatScene from './scenes/CombatScene.js';

// System Scenes
import LoginScene from './scenes/LoginScene.js';
import PreloaderScene from './scenes/PreloaderScene.js';
import MenuTestScene from './scenes/dev_scenes/MenuTestScene.js';


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
        MenuTestScene,
        ExpeditionScene,
        CombatScene,
        EldergroveTownScene,
        EldergroveArcaniumScene,
        EldergroveBlacksmithScene,
        EldergroveGuildhallScene,
        EldergroveMarketScene,
        EldergroveMapScene,
        TilfordExterior1Scene,
        TilfordExterior2Scene,
        TilfordExterior3Scene,
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
