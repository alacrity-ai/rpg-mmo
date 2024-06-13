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
        this.attachMoveKeysListener();
        this.attachTileHoverListener();
        // Listen for navigation button clicks
        this.scene.events.on('moveButtonClicked', this.handleMove, this);
        this.scene.events.on('tileSelected', (data) => console.log('Tile selected:', data));
        this.scene.events.on('tileFocused', (data) => console.log('Tile focused:', data));
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

    attachTileHoverListener() {
        // Attach hover event listener to each of the tiles
        for (let y = 0; y < this.battleGrid.grid.length; y++) {
            for (let x = 0; x < this.battleGrid.grid[y].length; x++) {
                const tile = this.battleGrid.grid[y][x];
                tile.sprite.setInteractive();

                tile.sprite.on('pointerover', () => {
                    this.scene.events.emit('tileHovered', { x, y });
                });

                tile.sprite.on('pointerout', () => {
                    this.scene.events.emit('tileHoveredOff', { x, y });
                });
            }
        }
    }

    attachMoveKeysListener() {
        const keysPressed = new Set();
        let moveTimeout = null;
        const moveDelay = 50;
    
        this.scene.input.keyboard.on('keydown', (event) => {
            keysPressed.add(event.key.toLowerCase());
            scheduleEmitMoveDirection();
        });
    
        this.scene.input.keyboard.on('keyup', (event) => {
            keysPressed.delete(event.key.toLowerCase());
            scheduleEmitMoveDirection();
        });
    
        const scheduleEmitMoveDirection = () => {
            if (moveTimeout) {
                clearTimeout(moveTimeout);
            }
    
            moveTimeout = setTimeout(() => {
                emitMoveDirection();
            }, moveDelay);
        };
    
        const emitMoveDirection = () => {
            let direction = [0, 0];
    
            if (keysPressed.has('w')) direction[1] -= 1;
            if (keysPressed.has('a')) direction[0] -= 1;
            if (keysPressed.has('s')) direction[1] += 1;
            if (keysPressed.has('d')) direction[0] += 1;
    
            // Clamp the values to ensure they are within the range -1 to 1
            direction[0] = Math.max(-1, Math.min(1, direction[0]));
            direction[1] = Math.max(-1, Math.min(1, direction[1]));
    
            if (direction[0] !== 0 || direction[1] !== 0) {
                this.scene.events.emit('moveButtonClicked', direction);
            }
        };
    }    
    
    attachSelectTileListener() {
        // Attach click event listener to each of the tiles
        for (let y = 0; y < this.battleGrid.grid.length; y++) {
            for (let x = 0; x < this.battleGrid.grid[y].length; x++) {
                const tile = this.battleGrid.grid[y][x];
                tile.sprite.setInteractive();
    
                tile.sprite.on('pointerdown', (pointer) => {
                    if (pointer.leftButtonDown()) {
                        const selectedTile = this.battleGrid.selectedTiles.find(([selectedX, selectedY]) => selectedX === x && selectedY === y);
    
                        if (selectedTile && this.battleGrid.tileFocused) {
                            // Deselect the tile
                            this.battleGrid.clearTileSelections();
                            this.scene.events.emit('tileUnfocused', { x, y });
                        } else {
                            // Select the tile
                            this.scene.events.emit('tileFocused', { x, y });
                        }
                    }
                });
            }
        }
    }
    

    handleMove(direction) {
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

        // Verify that were are not moving to the same position
        if (currentPosition[0] === newPosition[0] && currentPosition[1] === newPosition[1]) {
            return;
        }

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
        api.battlerAction.addBattlerAction(battleInstanceId, this.battlerId, 'move', actionData)
            .then(response => {
                // Insert action here if needed
            })
            .catch(error => {
                console.error('Failed to add action:', error);
            });
    }

    cleanup() {
        this.scene.events.off('moveButtonClicked', this.handleMove, this);
        this.scene.events.off('tileSelected', (data) => console.log('Tile selected:', data));
    }
}
