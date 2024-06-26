import Phaser from 'phaser';
import CircleMaskImagePlugin from 'phaser3-rex-plugins/plugins/circlemaskimage-plugin.js';
import SocketManager from './SocketManager.js';

// Game Scenes
import WorldmapScene from './scenes/WorldmapScene.js';

// System Scenes
import LoginScene from './scenes/LoginScene.js';
import PreloaderScene from './scenes/PreloaderScene.js';
import MenuTestScene from './scenes/dev_scenes/MenuTestScene.js';

// Test scenes
import AreaSceneTest from './scenes/AreaSceneTest.js'

// Handles loading all other scenes dynamically
import { loadScenes } from './scenes/utils/LoadScenes.js';

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
        WorldmapScene,
        LoginScene,
        AreaSceneTest
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
    pixelArt: false // Ensures pixel art is rendered without smoothing
};

// Disable the context menu on right-click
document.addEventListener('contextmenu', event => event.preventDefault());

// Connect to the server using the URL from .env
const url = import.meta.env.VITE_SERVER_URL;
console.log(`Server URL: ${url}`);

SocketManager.connect(url).then(async () => {
    console.log('Socket connected, starting Phaser game...');
    
    // Load all town scenes dynamically
    const townScenes = await loadScenes();
    
    // Add town scenes to the Phaser game configuration
    config.scene.push(...townScenes);
    
    // Create a new Phaser game instance after the socket connection is established
    const game = new Phaser.Game(config);

    game.events.on('changeScene', (sceneKey) => {
        // Get the scene object by key
        const scene = game.scene.getScene(sceneKey);
        SocketManager.setCurrentScene(scene);
    });

}).catch((err) => {
    console.error('Failed to connect to the server, cannot start the game.', err);
});
