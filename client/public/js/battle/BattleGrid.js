import Battler from './Battler.js';
import Tile from './Tile.js';
import { generateGradientTexture, generateBorderTexture } from './BattleGridTiles.js';

class BattleGrid {
    constructor(scene, battleTileImagePath) {
        this.scene = scene;
        this.battleTileImagePath = battleTileImagePath;
        this.grid = [];
        this.battlerPositions = new Map(); // To track battler positions
        this.battlerInstanceMap = new Map(); // To track battler instances
        this.selectedTiles = []; // To track the selected tiles
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
        // 0x703838 = Dark red
        // 0xC27F7F = Muted light red
        // Dark purple = 0x2E2E4A
        // Light purple = 0x6E6E8B
        // Neon violet = 0x8A2BE2
        // Dark violet = 0x4B0082
        // Neon Red = 0xFF0000
        // Dark Neon Red = 0xA63D1D
        // Neon Green = 0x00FF00
        // Dark Neon Green = 0x2E4A2E
        // Faint red = 0xFFD700
        // Whitish red = 0xFFE4E1
        // Grey = 0x808080
        generateGradientTexture(this.scene, 0x2E4A2E, 0x6E8B6E, 0.4, false, 0xFFFFFF, 'unoccupied_green'); // Dark green to muted light green
        generateGradientTexture(this.scene, 0x3C6B3C, 0x7CAF7C, 0.8, false, 0xFFFFFF, 'occupied_green'); // Dark green to less muted light green with border
        generateGradientTexture(this.scene, 0x582C2C, 0xB47F7F, 0.4, false, 0xFFFFFF, 'unoccupied_red'); // Dark red to muted light red
        generateGradientTexture(this.scene, 0x703838, 0xC27F7F, 0.8, false, 0xFFFFFF, 'occupied_red'); // Dark red to less muted light red with border
        generateGradientTexture(this.scene, 0xA63D1D, 0xCC8A45, 1, false, 0xFFFFFF, 'telegraph'); // Dark orange to muted light orange with brown border
        generateBorderTexture(this.scene, 0x2E4A2E, 0x00FF00, 1, 'selected_green', 0xFFFFFF); // Dark green to muted light green with gold border
        generateBorderTexture(this.scene, 0xA63D1D, 0xFF0000, 1, 'selected_red', 0xFFFFFF); // Dark red to muted light red with red border
        // Generate a line for 'selected_inactive', it should be grey
        // 
        generateBorderTexture(this.scene, 0x582C2C, 0x582C2C, 0.5, 'selected_inactive', 0x808080); // Dark grey to muted light grey with gold border
        generateBorderTexture(this.scene, 0xA63D1D, 0xCC8A45, 1, 'telegraph_selected_gold', 0xFFD700); // Dark orange to muted light orange with gold border
        generateBorderTexture(this.scene, 0xA63D1D, 0xCC8A45, 0.4, 'telegraph_selected_red', 0xFF0000); // Dark orange to muted light orange with red border
    }

    renderGrid() {
        const tileWidth = 84; // Default 96
        const tileHeight = 32; // Default 96
        const gridWidth = 6;
        const gridHeight = 3;
        const separation = 24; // Separation between player and enemy tiles
        const buffer = 4; // Buffer between tiles
    
        // Calculate the total width and height of the grid including separation and overlap
        const totalGridWidth = (tileWidth + buffer) * gridWidth + separation - buffer;
        const totalGridHeight = (tileHeight + buffer) * gridHeight - buffer;
    
        // Calculate the offsets to center the grid
        const offsetX = (this.scene.scale.width - totalGridWidth) / 2;
        const offsetY = (this.scene.scale.height - totalGridHeight) / 2 + 108;
    
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
                const isPlayerSide = x < 3;
                const textureKey = isPlayerSide ? 'unoccupied_green' : 'unoccupied_red';

                // Create a tile using the initial texture
                const tile = new Tile(this.scene, offsetX + adjustedX, offsetY + adjustedY, textureKey, isPlayerSide);
    
                this.grid[y][x] = tile;
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
        const tileObject = this.grid[y][x];
        tileObject.addBattler(battlerId);
        this.battlerPositions.set(battlerId, tile);

        // Update the tile texture
        tileObject.updateTexture();

        // If there are other battlers on the same tile, render the current battler above them
        const battlerInstance = this.getBattlerInstance(battlerId);
        if (tileObject.battlers.length > 1) {
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
        const tileObject = this.grid[y][x];
        tileObject.removeBattler(battlerId);
        this.battlerPositions.delete(battlerId);

        // Update the tile texture
        tileObject.updateTexture();
    }

    selectTile(x, y, inactive = false) {
        // Deselect all currently selected tiles
        this.clearTileSelections();

        // Select the new tile and add it to the selected tiles array
        const tile = this.grid[y][x];
        tile.select(inactive);
        this.selectedTiles.push([x, y]);
    }

    selectTiles(tiles) {
        // Deselect all currently selected tiles
        this.clearTileSelections();

        // Select new tiles and add them to the selected tiles array
        tiles.forEach(([x, y, inactive]) => {
            const tile = this.grid[y][x];
            tile.select(inactive);
            this.selectedTiles.push([x, y]);
        });
    }

    clearTileSelections() {
        // Deselect all currently selected tiles
        this.selectedTiles.forEach(([prevX, prevY]) => {
            this.grid[prevY][prevX].deselect();
        });

        // Clear the selected tiles array
        this.selectedTiles = [];
    }

    getSelectedTiles() {
        return this.selectedTiles.map(([x, y]) => this.grid[y][x]);
    }

    showTelegraph(tiles, duration) {
        // Increase the telegraph count and set the telegraph texture
        tiles.forEach(([x, y]) => {
            const tile = this.grid[y][x];
            tile.showTelegraph();
        });

        // Restore the appropriate texture after the duration
        this.scene.time.delayedCall(duration, () => {
            tiles.forEach(([x, y]) => {
                const tile = this.grid[y][x];
                tile.hideTelegraph();
            });
        });
    }
}

export default BattleGrid;
