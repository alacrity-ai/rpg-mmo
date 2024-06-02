import Phaser from 'phaser';
import MusicManager from '../audio/MusicManager.js';
import SoundFXManager from '../audio/SoundFXManager.js';
import BattleGrid from '../battle/BattleGrid.js';
import BattleGridInput from '../battle/BattleGridInput.js';
import CustomCursor from '../interface/CustomCursor.js';
import ActionBarMenu from '../interface/menu/ActionBarMenu.js';
import StatsMenu from '../interface/menu/BattleStatbarsMenu.js';
import SocketManager from '../SocketManager.js';
import { addBackgroundImage } from '../graphics/BackgroundManager.js';
import api from '../api';

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

        // Initialize the BattleGridInput class
        const battleGridInput = new BattleGridInput(this.battleGrid, this.battlerId);

        // Initialize the ActionBarMenu
        this.actionBarMenu = new ActionBarMenu(this, this.battleInstanceId, this.battlerId, this.battleGrid);
        this.actionBarMenu.show();

        // Listen for navigation button clicks
        this.events.on('moveButtonClicked', this.handleMoveButtonClicked, this);
        this.events.on('tileSelected', (data) => console.log('Tile selected:', data));

        // Initialize the StatsMenu with mock data
        this.statsMenu = new StatsMenu(this, this.battler.currentStats.health, this.battler.baseStats.health, this.battler.currentStats.mana, this.battler.baseStats.mana);
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

        if (Math.abs(direction[0]) > 1 || Math.abs(direction[1]) > 1) {
            console.log('Only 1 tile of movement permitted');
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

    cleanup() {
        // Do cleanup tasks as needed
    }
}
