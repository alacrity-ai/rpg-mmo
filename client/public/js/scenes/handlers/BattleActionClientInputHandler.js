// BattleActionClientInputHandler.js

import api from '../../api';

export default class BattleActionClientInputHandler {
    constructor(scene, battleGrid, actionBar, battlerId) {
        this.scene = scene;
        this.battleGrid = battleGrid;
        this.battlerId = battlerId;
        this.actionBar = actionBar;
    }

    initialize() {
        this.attachRightClickListener();
        this.attachSelectTileListener();
        // Listen for navigation button clicks
        this.scene.events.on('moveButtonClicked', this.handleMoveAction, this);
        this.scene.events.on('tileSelected', (data) => console.log('Tile selected:', data));
    }

    attachRightClickListener() {
        // Attach right click event listener to each of the tiles in the first 3 columns
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                const tile = this.battleGrid.grid[y][x];
                tile.sprite.setInteractive();

                tile.sprite.on('pointerdown', (pointer) => {
                    if (pointer.rightButtonDown()) {
                        // On right click, determine the current position of the given battler id
                        const currentPosition = this.battleGrid.getBattlerPosition(this.battlerId);

                        if (!currentPosition) return; // If the battler is not found, exit

                        const [currentX, currentY] = currentPosition;

                        // Determine the direction of the right click relative to the battler
                        const direction = [x - currentX, y - currentY];

                        // Emit the moveButtonClicked event with the direction
                        this.scene.events.emit('moveButtonClicked', direction);
                    }
                });
            }
        }
    }

    attachSelectTileListener() {
        // Attach click event listener to each of the tiles
        for (let y = 0; y < this.battleGrid.grid.length; y++) {
            for (let x = 0; x < this.battleGrid.grid[y].length; x++) {
                const tile = this.battleGrid.grid[y][x];
                tile.sprite.setInteractive();

                tile.sprite.on('pointerdown', (pointer) => {
                    if (pointer.leftButtonDown()) {
                        // Emit the tileSelected event with the x, y coordinates of the selected tile
                        this.scene.events.emit('tileSelected', { x, y });
                    }
                });
            }
        }
    }

    handleMoveAction(direction) {
        // Don't allow movement if the action bar is on cooldown
        if (this.actionBar.isOnCooldown()) {
            console.log('Cannot move while on cooldown');
            return;
        }
        
        // Get the current position
        const currentPosition = this.battleGrid.getBattlerPosition(this.battlerId);
        if (!currentPosition) {
            console.error(`Battler position not found for battlerId: ${this.battlerId}`);
            return;
        }

        const [currentBattlerX, currentBattlerY] = currentPosition;

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
        
        // Get this battleInstance
        const battleInstanceId = this.scene.battleInstanceId

        // Send movement request to server
        const actionData = { newPosition: newPosition, currentPosition: currentPosition, team: 'player' };
        console.log(`Calling addBattlerAction with: ${battleInstanceId}, ${this.battlerId}, move, ${actionData}`)
        api.battlerAction.addBattlerAction(battleInstanceId, this.battlerId, 'move', actionData)
            .then(response => {
                // Insert action here if needed
            })
            .catch(error => {
                console.error('Failed to add action:', error);
            });
    }

    cleanup() {
        this.scene.events.off('moveButtonClicked', this.handleMoveAction, this);
        this.scene.events.off('tileSelected', (data) => console.log('Tile selected:', data));
    }
}
