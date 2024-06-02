import Phaser from 'phaser';

export default class BattleGridInput {
    constructor(battleGrid, battlerId) {
        this.battleGrid = battleGrid;
        this.battlerId = battlerId;
        this.attachRightClickListener();
        this.attachSelectTileListener();
    }

    attachRightClickListener() {
        // Attach right click event listener to each of the tiles in the first 3 columns
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                const tile = this.battleGrid.grid[y][x].tile;
                tile.setInteractive();

                tile.on('pointerdown', (pointer) => {
                    if (pointer.rightButtonDown()) {
                        // On right click, determine the current position of the given battler id
                        const currentPosition = this.battleGrid.getBattlerPosition(this.battlerId);

                        if (!currentPosition) return; // If the battler is not found, exit

                        const [currentX, currentY] = currentPosition;

                        // Determine the direction of the right click relative to the battler
                        const direction = [x - currentX, y - currentY];

                        // Emit the moveButtonClicked event with the direction
                        this.battleGrid.scene.events.emit('moveButtonClicked', direction);
                    }
                });
            }
        }
    }

    attachSelectTileListener() {
        // Attach click event listener to each of the tiles
        for (let y = 0; y < this.battleGrid.grid.length; y++) {
            for (let x = 0; x < this.battleGrid.grid[y].length; x++) {
                const tile = this.battleGrid.grid[y][x].tile;
                tile.setInteractive();

                tile.on('pointerdown', (pointer) => {
                    if (pointer.leftButtonDown()) {
                        // Emit the tileSelected event with the x, y coordinates of the selected tile
                        this.battleGrid.scene.events.emit('tileSelected', { x, y });
                    }
                });
            }
        }
    }
}
