import Battler from './Battler.js';

class BattleGrid {
    constructor(scene, battleTileImagePath) {
        this.scene = scene;
        this.battleTileImagePath = battleTileImagePath;
        this.grid = [];
        this.battlerPositions = new Map(); // To track battler positions
        this.battlerInstanceMap = new Map(); // To track battler instances
    }

    initialize() {
        // Use the image path as the key to load the tile image
        this.scene.load.image(this.battleTileImagePath, this.battleTileImagePath);
    }

    createTileGrid() {
        // Logic to create the grid of tiles
        this.renderGrid();
    }

    renderGrid() {
        const tileWidth = 96;
        const tileHeight = 96;
        const gridWidth = 6;
        const gridHeight = 3;
        const separation = 8; // Separation between player and enemy tiles
        const overlap = 6; // Number of pixels to overlap tiles vertically

        // Calculate the total width and height of the grid including separation and overlap
        const totalGridWidth = tileWidth * gridWidth + separation;
        const totalGridHeight = tileHeight * gridHeight - overlap * 2;

        // Calculate the offsets to center the grid
        const offsetX = (this.scene.scale.width - totalGridWidth) / 2;
        const offsetY = (this.scene.scale.height - totalGridHeight) / 2;

        for (let y = 0; y < gridHeight; y++) {
            this.grid[y] = [];
            for (let x = 0; x < gridWidth; x++) {
                let adjustedX = x * tileWidth;
                let adjustedY = y * (tileHeight - overlap);

                if (x >= 3) {
                    // Add separation for enemy tiles
                    adjustedX += separation;
                }
                const tile = this.scene.add.image(offsetX + adjustedX, offsetY + adjustedY, this.battleTileImagePath);
                tile.setOrigin(0, 0);

                // Apply a more subtle tint based on row to create depth
                if (y === 0) {
                    tile.setTint(0xAAAAAA); // Subtle darkening for the top row
                } else if (y === 1) {
                    tile.setTint(0xDDDDDD); // Very slight darkening for the middle row
                }

                this.grid[y][x] = {
                    tile,
                    battlers: [] // To store battlers on this tile
                };
            }
        }
    }

    async addBattler(battlerData, initialTile) {
        const battler = new Battler(this.scene, battlerData, initialTile);
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
        // Add the battlerId to the battlerPositions map, e.g. {... 'battlerId': [x, y] ...}
        this.battlerPositions.set(battlerId, tile);
    }

    removeBattlerFromTile(battlerId, tile) {
        // Remove battler from the specified tile
        const [x, y] = tile;
        const index = this.grid[y][x].battlers.indexOf(battlerId);
        if (index > -1) {
            this.grid[y][x].battlers.splice(index, 1);
        }
        // Remove the battlerId from the battlerPositions map
        this.battlerPositions.delete(battlerId);
    }
}

export default BattleGrid;
