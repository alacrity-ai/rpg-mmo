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
            let isThisPlayer = false;
            if (battlerData.characterId === this.registry.get('characterId')) {
                isThisPlayer = true;
            } 
            await this.battleGrid.addBattler(battlerData, battlerData.gridPosition, isThisPlayer);
        }

        // Initialize the CustomCursor
        CustomCursor.getInstance(this);

        // Initialize SoundFXManager
        SoundFXManager.initialize(this);

        // Get the battlerId for the current character
        this.battlerId = battlersData.find(battler => battler.characterId === this.registry.get('characterId')).id;

        // Initialize the ActionBarMenu
        this.actionBarMenu = new ActionBarMenu(this, this.battleInstanceId, this.BattlerId, this.battleGrid);
        this.actionBarMenu.show();

        // Listen for navigation button clicks
        this.events.on('moveButtonClicked', this.handleMoveButtonClicked, this);

        // Initialize the StatsMenu with mock data
        this.statsMenu = new StatsMenu(this, battlersData[0].currentStats.health, battlersData[0].baseStats.health, battlersData[0].currentStats.mana, battlersData[0].baseStats.mana);
        this.statsMenu.show();

        // Listen for completed battler actions
        SocketManager.getSocket().on('completedBattlerAction', this.handleCompletedBattlerAction.bind(this));
    }

    handleMoveButtonClicked(direction) {
        // Get the current position
        const currentPosition = this.battleGrid.getBattlerPosition(this.battlerId);
        const [currentBattlerX, currentBattlerY] = currentPosition;
        if (!currentPosition) {
            console.error(`Battler position not found for battlerId: ${this.battlerId}`);
            return;
        }
        
        // Get the current position, and the new position
        const newPosition = [currentBattlerX + direction[0], currentBattlerY + direction[1]];

        // Verify that the new position is in bounds
        if (!this.battleGrid.positionInBounds(newPosition, 'player')) {
            console.log('New position is out of bounds:', newPosition);
            return;
        }
        
        // Send movement request to server
        const actionData = { newPosition: newPosition, currentPosition: currentPosition, team: 'player' };
        api.battlerAction.addBattlerAction(this.battleInstanceId, this.battlerId, 'move', actionData)
            .then(response => {
                console.log('Action added successfully:', response);
            })
            .catch(error => {
                console.error('Failed to add action:', error);
            });
    }

    handleCompletedBattlerAction(data) {
        if (data.actionType === 'move') {
            this.actionBarMenu.triggerGlobalCooldown(this.registry.get('settings').cooldowns.short);
            const battlerInstance = this.battleGrid.getBattlerInstance(data.battlerId);
            battlerInstance.moveToTile(data.actionData.newPosition, this.battleGrid);
        }
        // Handle other action types as needed
    }

    update(time, delta) {
        // Update custom cursor position
        CustomCursor.getInstance(this).update();    
    }
}
