import Phaser from 'phaser';
import MusicManager from '../audio/MusicManager.js';
import SoundFXManager from '../audio/SoundFXManager.js';
import BattleGrid from '../battle/BattleGrid.js';
import CustomCursor from '../interface/CustomCursor.js';
import ActionBarMenu from '../interface/menu/ActionBarMenu.js';
import StatsMenu from '../interface/menu/BattleStatbarsMenu.js';
import Debug from '../interface/Debug.js';

export default class BattleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BattleScene' });
    }

    preload() {
        // this.load.audio('assets/music/heroic_drums.mp3', 'assets/music/heroic_drums.mp3');
        
        // Initialize the BattleGrid and load assets
        this.battleGrid = new BattleGrid(this, 'assets/images/battle/tiles/grass1_96.png');
        this.battleGrid.initialize();
    }

    async create() {
        // Play background music
        // MusicManager.playMusic('assets/music/heroic_drums.mp3');

        // Create the BattleGrid
        this.battleGrid.createTileGrid();

        // Mock battler data for testing
        const mockBattlers = [
            {
                id: 1,
                spritePath: 'assets/images/characters/rogue/combat/atlas.png',
                team: 'player',
                initialTile: [0, 0]
            },
            {
                id: 2,
                spritePath: 'assets/images/characters/warrior/combat/atlas.png',
                team: 'player',
                initialTile: [2, 2]
            },
            {
                id: 3,
                spritePath: 'assets/images/battle/battlers/sprite_28.png',
                team: 'enemy',
                initialTile: [3, 0]
            },
            {
                id: 4,
                spritePath: 'assets/images/battle/battlers/sprite_29.png',
                team: 'enemy',
                initialTile: [5, 2]
            }
        ];

        // Add mock battlers to the grid
        for (const battlerData of mockBattlers) {
            await this.battleGrid.addBattler(battlerData, battlerData.initialTile);
        }

        // Initialize the CustomCursor
        CustomCursor.getInstance(this);

        // Initialize SoundFXManager
        SoundFXManager.initialize(this);

        // Initialize the ActionBarMenu
        this.actionBarMenu = new ActionBarMenu(this);
        this.actionBarMenu.show();

        // Initialize the StatsMenu with mock data
        const currentHealth = 75;
        const maxHealth = 100;
        const currentMana = 50;
        const maxMana = 100;
        this.statsMenu = new StatsMenu(this, currentHealth, maxHealth, currentMana, maxMana);
        this.statsMenu.show();

        // // Initialize the Debug class
        // this.debug = new Debug(this);
    }

    update(time, delta) {
        // Update custom cursor position
        CustomCursor.getInstance(this).update();

        // // Update debug coordinates
        // this.debug.update(this.input.activePointer);        
    }
}
