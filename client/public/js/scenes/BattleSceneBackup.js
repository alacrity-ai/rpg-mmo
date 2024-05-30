import Phaser from 'phaser';
import MusicManager from '../audio/MusicManager.js';
import SoundFXManager from '../audio/SoundFXManager.js';
import BattleGrid from '../battle/BattleGrid.js';
import CustomCursor from '../interface/CustomCursor.js';
import Debug from '../interface/Debug.js';

export default class BattleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BattleScene' });
    }

    preload() {
        this.load.audio('assets/music/intro_heroic.mp3', 'assets/music/intro_heroic.mp3');
        
        // Initialize the BattleGrid and load assets
        this.battleGrid = new BattleGrid(this, 'assets/images/battle/tiles/grass1_96.png');
        this.battleGrid.initialize();
    }

    create() {
        // Play background music
        MusicManager.playMusic('assets/music/intro_heroic.mp3');

        // Create the BattleGrid
        this.battleGrid.createTileGrid();

        // Initialize the CustomCursor
        CustomCursor.getInstance(this);

        // Initialize SoundFXManager
        SoundFXManager.initialize(this);

        // Initialize the Debug class
        this.debug = new Debug(this);
    }

    update(time, delta) {
        // Update custom cursor position
        CustomCursor.getInstance(this).update();

        // // Update debug coordinates
        // this.debug.update(this.input.activePointer);        
    }
}
