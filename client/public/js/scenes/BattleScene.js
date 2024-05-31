import Phaser from 'phaser';
import MusicManager from '../audio/MusicManager.js';
import SoundFXManager from '../audio/SoundFXManager.js';
import BattleGrid from '../battle/BattleGrid.js';
import CustomCursor from '../interface/CustomCursor.js';
import ActionBarMenu from '../interface/menu/ActionBarMenu.js';
import StatsMenu from '../interface/menu/BattleStatbarsMenu.js';
import SocketManager from '../SocketManager.js';
import api from '../api';

export default class BattleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BattleScene' });
        this.battleInstanceId = 2; // Will be passed in from the server
    }

    preload() {
        this.load.audio('assets/music/heroic_drums.mp3', 'assets/music/heroic_drums.mp3');
        
        // Initialize the BattleGrid and load assets
        this.battleGrid = new BattleGrid(this, 'assets/images/battle/tiles/grass1_96.png');
        this.battleGrid.initialize();

        // Join the battle
        SocketManager.joinBattle(this.battleInstanceId);
    }

    async create() {
        // Play background music
        MusicManager.playMusic('assets/music/heroic_drums.mp3');

        // Create the BattleGrid
        this.battleGrid.createTileGrid();

        // Mock battler data for testing
        const battlersData = [
            {
                id: 5,
                characterId: 3,
                spritePath: 'assets/images/characters/rogue/combat/atlas.png',
                team: 'player',
                baseStats: { health: 100, mana: 50, strength: 16, stamina: 12, intelligence: 14 },
                currentStats: { health: 80, mana: 50, strength: 16, stamina: 12, intelligence: 14 },
                gridPosition: [0, 0]
            },
            {
                id: 6,
                characterId: 4,
                spritePath: 'assets/images/characters/warrior/combat/atlas.png',
                team: 'player',
                baseStats: { health: 140, mana: 30, strength: 20, stamina: 15, intelligence: 10 },
                currentStats: { health: 120, mana: 30, strength: 20, stamina: 15, intelligence: 10 },
                gridPosition: [2, 2]
            },
            {
                id: 3,
                spritePath: 'assets/images/battle/battlers/sprite_28.png',
                team: 'enemy',
                gridPosition: [3, 0]
            },
            {
                id: 4,
                spritePath: 'assets/images/battle/battlers/sprite_29.png',
                team: 'enemy',
                gridPosition: [5, 2]
            }
        ];

        // Add mock battlers to the grid
        for (const battlerData of battlersData) {
            await this.battleGrid.addBattler(battlerData, battlerData.gridPosition);
        }

        // Initialize the CustomCursor
        CustomCursor.getInstance(this);

        // Initialize SoundFXManager
        SoundFXManager.initialize(this);

        // Get the battlerId for the current character
        this.battlerId = battlersData.find(battler => battler.characterId === this.registry.get('characterId')).id;
        console.log('Current battlerId:', this.battlerId)
        console.log('Grid ', JSON.stringify(this.battleGrid.grid))


        // Initialize the ActionBarMenu
        this.actionBarMenu = new ActionBarMenu(this, this.battleInstanceId, this.BattlerId, this.battleGrid);
        this.actionBarMenu.show();

        // Listen for navigation button clicks
        this.events.on('navigationButtonClicked', this.handleNavigationButtonClicked, this);

        // Initialize the StatsMenu with mock data
        this.statsMenu = new StatsMenu(this, battlersData[0].currentStats.health, battlersData[0].baseStats.health, battlersData[0].currentStats.mana, battlersData[0].baseStats.mana);
        this.statsMenu.show();

        console.log('Battler Positions ', this.battleGrid.battlerPositions);

        // Listen for completed battler actions
        SocketManager.getSocket().on('completedBattlerAction', this.handleCompletedBattlerAction.bind(this));
    }

    handleNavigationButtonClicked(direction) {

        const currentPosition = this.battleGrid.getBattlerPosition(this.battlerId);
        if (!currentPosition) {
            console.error(`Battler position not found for battlerId: ${this.battlerId}`);
            return;
        }
        const [currentBattlerX, currentBattlerY] = currentPosition;

        const newPosition = [currentBattlerX + direction[0], currentBattlerY + direction[1]];
        const actionData = { newPosition: newPosition };

        // battleInstanceId, battlerId, actionType, actionData
        api.battlerAction.addBattlerAction(this.battleInstanceId, this.battlerId, 'move', actionData)
            .then(response => {
                console.log('Action added successfully:', response);
            })
            .catch(error => {
                console.error('Failed to add action:', error);
            });
    }

    handleCompletedBattlerAction(data) {
        console.log('Completed battler action:', data);
        if (data.actionType === 'move') {
            console.log(`Moving battler ${data.battlerId} to position ${data.actionData.newPosition}`);
            const battlerInstance = this.battleGrid.getBattlerInstance(data.battlerId);
            console.log(battlerInstance);
            battlerInstance.moveToTile(data.actionData.newPosition, this.battleGrid);
        }
        // Handle other action types as needed
    }

    update(time, delta) {
        // Update custom cursor position
        CustomCursor.getInstance(this).update();    
    }
}
