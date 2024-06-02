import Battler from './Battler.js';
import { generateGradientTexture, generateBorderTexture } from './BattleGridTiles.js';

class BattleGrid {
    constructor(scene, battleTileImagePath) {
        this.scene = scene;
        this.battleTileImagePath = battleTileImagePath;
        this.grid = [];
        this.battlerPositions = new Map(); // To track battler positions
        this.battlerInstanceMap = new Map(); // To track battler instances
        this.selectedTile = null; // To track the selected tile
    }

    initialize() {
        // Use the image path as the key to load the tile image
        this.scene.load.image(this.battleTileImagePath, this.battleTileImagePath);

        // Listen for emissions in the scene to show a telegraph
        this.scene.events.on('showTelegraph', (tiles, duration) => {
            this.showTelegraph(tiles, duration);
        });

        // Listen for tile selection
        this.scene.events.on('tileSelected', ({ x, y }) => {
            this.selectTile(x, y);
        });
    }

    createTileGrid() {
        // Pre-generate the textures
        this.generateTextures();
        
        // Logic to create the grid of tiles
        this.renderGrid();
    }

    generateTextures() {
        // Dramatic colors for the gradients from dark to light
        generateGradientTexture(this.scene, 0x2E4A2E, 0x6E8B6E, 0.2, false, 0xFFFFFF, 'unoccupied_green'); // Dark green to muted light green
        generateGradientTexture(this.scene, 0x3C6B3C, 0x7CAF7C, 0.4, true, 0xFFFFFF, 'occupied_green'); // Dark green to less muted light green with border
        generateGradientTexture(this.scene, 0x582C2C, 0xB47F7F, 0.2, false, 0xFFFFFF, 'unoccupied_red'); // Dark red to muted light red
        generateGradientTexture(this.scene, 0x703838, 0xC27F7F, 0.8, true, 0xFFFFFF, 'occupied_red'); // Dark red to less muted light red with border
        generateGradientTexture(this.scene, 0xA63D1D, 0xCC8A45, 0.4, false, 0xFFFFFF, 'telegraph'); // Dark orange to muted light orange with brown border
        generateBorderTexture(this.scene, 0x2E4A2E, 0x6E8B6E, 0.2, 'selected_green', 0xFFD700); // Dark green to muted light green with gold border
        generateBorderTexture(this.scene, 0x582C2C, 0xB47F7F, 0.2, 'selected_red', 0xFF0000); // Dark red to muted light red with red border
        generateBorderTexture(this.scene, 0xA63D1D, 0xCC8A45, 0.4, 'telegraph_selected_gold', 0xFFD700); // Dark orange to muted light orange with gold border
        generateBorderTexture(this.scene, 0xA63D1D, 0xCC8A45, 0.4, 'telegraph_selected_red', 0xFF0000); // Dark orange to muted light orange with red border
    }

    renderGrid() {
        const tileWidth = 84; // Default 96
        const tileHeight = 42; // Default 96
        const gridWidth = 6;
        const gridHeight = 3;
        const separation = 24; // Separation between player and enemy tiles
        const buffer = 4; // Buffer between tiles
    
        // Calculate the total width and height of the grid including separation and overlap
        const totalGridWidth = (tileWidth + buffer) * gridWidth + separation - buffer;
        const totalGridHeight = (tileHeight + buffer) * gridHeight - buffer;
    
        // Calculate the offsets to center the grid
        const offsetX = (this.scene.scale.width - totalGridWidth) / 2;
        const offsetY = (this.scene.scale.height - totalGridHeight) / 2 + 72;
    
        for (let y = 0; y < gridHeight; y++) {
            this.grid[y] = [];
            for (let x = 0; x < gridWidth; x++) {
                let adjustedX = x * (tileWidth + buffer);
                let adjustedY = y * (tileHeight + buffer);
    
                if (x >= 3) {
                    // Add separation for enemy tiles
                    adjustedX += separation;
                }
    
                // Determine initial texture key
                const textureKey = x < 3 ? 'unoccupied_green' : 'unoccupied_red';

                // Create a sprite using the initial texture
                const tile = this.scene.add.sprite(offsetX + adjustedX, offsetY + adjustedY, textureKey);
                tile.setOrigin(0, 0);
    
                this.grid[y][x] = {
                    tile,
                    battlers: [], // To store battlers on this tile
                    telegraphCount: 0, // Count of active telegraphs affecting this tile
                    tween: null, // To store the tween reference for telegraphed tiles
                    selected: false // To track if the tile is selected
                };
            }
        }
    }

    async addBattler(battlerData, initialTile, isThisPlayer = false) {
        const battler = new Battler(this.scene, battlerData, initialTile, isThisPlayer);
        await battler.initialize();
        battler.create(this);
        this.battlerInstanceMap.set(battlerData.id, battler);
        this.addBattlerToTile(battlerData.id, initialTile); // Directly add the battler to the initial tile
    }

    getBattlerInstance(battlerId) {
        return this.battlerInstanceMap.get(battlerId);
    }

    getBattlerPosition(battlerId) {
        return this.battlerPositions.get(battlerId);
    }

    positionInBounds(position, team) {
        if (team === 'player') {
            return position[0] >= 0 && position[0] < 3 && position[1] >= 0 && position[1] < 3;
        } else if (team === 'enemy') {
            return position[0] >= 3 && position[0] < 6 && position[1] >= 0 && position[1] < 3;
        }
        return false;
    }

    moveBattler(battlerId, newTile) {
        // Logic to move the battler to the new tile
        const oldTile = this.battlerPositions.get(battlerId);
        if (oldTile) {
            this.removeBattlerFromTile(battlerId, oldTile);
        }
        this.addBattlerToTile(battlerId, newTile);
        this.battlerPositions.set(battlerId, newTile);
    }

    addBattlerToTile(battlerId, tile) {
        // Add battler to the specified tile
        const [x, y] = tile;
        if (!this.grid[y][x].battlers.includes(battlerId)) {
            this.grid[y][x].battlers.push(battlerId);
        }
        this.battlerPositions.set(battlerId, tile);

        // Update the tile texture
        this.updateTileTexture(x, y);

        // If there are other battlers on the same tile, render the current battler above them
        const battlerInstance = this.getBattlerInstance(battlerId);
        if (this.grid[y][x].battlers.length > 1) {
            if (battlerInstance && battlerInstance.renderAboveOthers) {
                battlerInstance.sprite.setDepth(y + 1);
            }
        } else {
            if (battlerInstance) {
                battlerInstance.sprite.setDepth(y);
            }
        }
    }

    removeBattlerFromTile(battlerId, tile) {
        // Remove battler from the specified tile
        const [x, y] = tile;
        const index = this.grid[y][x].battlers.indexOf(battlerId);
        if (index > -1) {
            this.grid[y][x].battlers.splice(index, 1);
        }
        this.battlerPositions.delete(battlerId);

        // Update the tile texture
        this.updateTileTexture(x, y);
    }

    updateTileTexture(x, y) {
        const isOccupied = this.grid[y][x].battlers.length > 0;
        let textureKey = x < 3 
            ? (isOccupied ? 'occupied_green' : 'unoccupied_green') 
            : (isOccupied ? 'occupied_red' : 'unoccupied_red');

        const tile = this.grid[y][x].tile;

        // Determine the texture key based on the tile's state
        if (this.grid[y][x].telegraphCount > 0) {
            textureKey = 'telegraph';
        }
        if (this.grid[y][x].selected) {
            if (this.grid[y][x].telegraphCount > 0) {
                textureKey = x < 3 ? 'telegraph_selected_gold' : 'telegraph_selected_red';
            } else {
                textureKey = x < 3 ? 'selected_green' : 'selected_red';
            }
        }

        tile.setTexture(textureKey);
        tile.setAlpha(1); // Reset the alpha if not telegraphed or selected

        // Remove the tween if it exists
        if (this.grid[y][x].tween) {
            this.grid[y][x].tween.stop();
            this.grid[y][x].tween = null;
        }

        // If the tile is selected, create the tween
        if (this.grid[y][x].selected) {
            if (!this.grid[y][x].tween) {
                this.grid[y][x].tween = this.scene.tweens.add({
                    targets: this.grid[y][x].tile,
                    alpha: { start: 1, to: 0.7 },
                    duration: 500,
                    yoyo: true,
                    repeat: -1
                });
            }
        }
    }

    selectTile(x, y) {
        // Deselect the currently selected tile
        if (this.selectedTile) {
            const [prevX, prevY] = this.selectedTile;
            this.grid[prevY][prevX].selected = false;
            this.updateTileTexture(prevX, prevY);
        }

        // Select the new tile
        this.selectedTile = [x, y];
        this.grid[y][x].selected = true;
        this.updateTileTexture(x, y);
    }

    showTelegraph(tiles, duration) {
        // Increase the telegraph count and set the telegraph texture
        tiles.forEach(([x, y]) => {
            this.grid[y][x].telegraphCount += 1;

            // Determine the correct texture for telegraphed tiles
            const textureKey = this.grid[y][x].selected ? (x < 3 ? 'telegraph_selected_gold' : 'telegraph_selected_red') : 'telegraph';
            this.grid[y][x].tile.setTexture(textureKey);

            // Create the tween for the telegraphed tile if not already created
            if (!this.grid[y][x].tween) {
                this.grid[y][x].tween = this.scene.tweens.add({
                    targets: this.grid[y][x].tile,
                    alpha: { start: 1, to: 0.7 },
                    duration: 500,
                    yoyo: true,
                    repeat: -1
                });
            }
        });

        // Restore the appropriate texture after the duration
        this.scene.time.delayedCall(duration, () => {
            tiles.forEach(([x, y]) => {
                this.grid[y][x].telegraphCount -= 1;
                if (this.grid[y][x].telegraphCount === 0) {
                    this.updateTileTexture(x, y);
                }
            });
        });
    }

    getSelectedTileCoords() {
        if (this.selectedTile) {
            return { x: this.selectedTile[0], y: this.selectedTile[1] };
        }
        return null;
    }
}

export default BattleGrid;
