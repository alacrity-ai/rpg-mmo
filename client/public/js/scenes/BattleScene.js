// BattleScene.js

import Phaser from 'phaser';
import BattleActionResponseHandler from './handlers/BattleActionResponseHandler';
import MusicManager from '../audio/MusicManager.js';
import SoundFXManager from '../audio/SoundFXManager.js';
import BattleGrid from '../battle/BattleGrid.js';
import BattleActionClientInputHandler from './handlers/BattleActionClientInputHandler.js';
import CustomCursor from '../interface/CustomCursor.js';
import ActionBarMenu from '../interface/menu/ActionBarMenu.js';
import StatsMenu from '../interface/menu/BattleStatbarsMenu.js';
import SocketManager from '../SocketManager.js';
import { addBackgroundImage } from '../graphics/BackgroundManager.js';

export default class BattleScene extends Phaser.Scene {
    constructor(key, battleInstanceData, battlerInstancesData, backgroundImage = 'assets/images/zone/area/normal/elderswood/battle.png') {
        super({ key });
        this.battleInstanceData = battleInstanceData;
        this.battlerInstancesData = battlerInstancesData;
        this.battleInstanceId = battleInstanceData.id;
        this.backgroundImage = backgroundImage;
    }

    preload() {
        this.load.audio('assets/music/heroic_drums.mp3', 'assets/music/heroic_drums.mp3');
        
        // Initialize the BattleGrid and load assets
        this.battleGrid = new BattleGrid(this, 'assets/images/battle/tiles/grass1_96.png');
        this.battleGrid.initialize();

        // Join the battle
        SocketManager.joinBattle(this.battleInstanceId);

        // Load background image (testing)
        this.load.image(this.backgroundImage, this.backgroundImage);
    }

    async create() {
        // Add the background image and ensure it fits the canvas
        addBackgroundImage(this, this.backgroundImage, this.sys.game.config.width, this.sys.game.config.height - 140, 0, 0, true);

        // Play background music
        MusicManager.playMusic('assets/music/heroic_drums.mp3');

        // Create the BattleGrid
        this.battleGrid.createTileGrid();

        // Initialize the CustomCursor
        CustomCursor.getInstance(this);

        // Initialize SoundFXManager
        SoundFXManager.initialize(this);

        // Get the battlerId for the current character
        this.battler = this.battlerInstancesData.find(battler => battler.characterId === this.registry.get('characterId'));
        this.battlerId = this.battler.id;

        // Add battlers to the grid
        for (const battlerData of this.battlerInstancesData) {
            await this.battleGrid.addBattler(battlerData, battlerData.gridPosition, battlerData.characterId === this.battlerId);
        }

        // Initialize the ActionBarMenu
        this.actionBarMenu = new ActionBarMenu(this, this.battleInstanceId, this.battlerId, this.battleGrid);
        this.actionBarMenu.show();

        // Initialize the StatsMenu with mock data
        this.statsMenu = new StatsMenu(this, this.battler.currentStats.health, this.battler.baseStats.health, this.battler.currentStats.mana, this.battler.baseStats.mana);
        this.statsMenu.show();

        // Get settings from registry
        const settings = this.registry.get('settings');

        // Initialize the action response handler for messages from the server
        this.actionResponseHandler = new BattleActionResponseHandler(this.battleGrid, this.actionBarMenu, settings);
        this.actionResponseHandler.initialize();

        // Initialize the BattleActionClientInputHandler for client local inputs
        this.battleActionClientInputHandler = new BattleActionClientInputHandler(this, this.battleGrid, this.actionBarMenu, this.battlerId);
        this.battleActionClientInputHandler.initialize();
    }

    update(time, delta) {
        // Update custom cursor position
        CustomCursor.getInstance(this).update();    
    }

    cleanup() {
        // Cleanup event listeners and other resources
        this.actionResponseHandler.cleanup();
        this.battleActionClientInputHandler.cleanup();
    }

    destroy() {
        this.cleanup();
        super.destroy();
    }
}
