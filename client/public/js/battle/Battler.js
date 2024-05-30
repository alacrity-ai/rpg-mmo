import BattlerSpriteManager from './BattlerSpriteManager.js';

class Battler {
    constructor(scene, battlerData, initialTile) {
        this.scene = scene;
        this.battlerData = battlerData;
        this.initialTile = initialTile;
        this.sprite = null;
        if (battlerData.team === 'player') {
            this.yOffset = -20;
        } else {
            this.yOffset = 0;
        
        }

    }

    async initialize() {
        this.spriteConfig = await BattlerSpriteManager.loadSprite(this.scene, this.battlerData);
    }

    create(battleGrid) {
        const [x, y] = this.initialTile;
        const tile = battleGrid.grid[y][x];
        // Calculate the position to center the sprite in the tile
        const position = {
            x: tile.tile.x + tile.tile.width / 2,
            y: tile.tile.y + this.yOffset
        };
        this.sprite = BattlerSpriteManager.createSprite(this.scene, this.battlerData, position, this.spriteConfig);
        battleGrid.addBattlerToTile(this.battlerData.id, this.initialTile);
    }

    playAnimation(animationKey) {
        if (this.sprite) {
            this.sprite.play(animationKey);
        }
    }

    moveToTile(newTile, battleGrid) {
        const [x, y] = newTile;
        const tile = battleGrid.grid[y][x];
        // Calculate the position to center the sprite in the tile
        const position = {
            x: tile.tile.x + tile.tile.width / 2,
            y: tile.tile.y + this.yOffset
        };
        this.scene.tweens.add({
            targets: this.sprite,
            x: position.x,
            y: position.y,
            duration: 500,
            onComplete: () => {
                battleGrid.moveBattler(this.battlerData.id, newTile);
            }
        });
    }
}

export default Battler;
