import BattlerSpriteManager from './BattlerSpriteManager.js';

class Battler {
    constructor(scene, battlerData, initialTile, isThisPlayer = false) {
        this.scene = scene;
        this.battlerData = battlerData;
        this.initialTile = initialTile;
        this.sprite = null;
        this.renderAboveOthers = isThisPlayer;
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
            x: tile.sprite.x + tile.sprite.width / 2 - 4,
            y: tile.sprite.y + this.yOffset - 32
        };
        this.sprite = BattlerSpriteManager.createSprite(this.scene, this.battlerData, position, this.spriteConfig);
        // If renderAboveOthers is true, set the depth to a higher value
        if (this.renderAboveOthers) {
            this.sprite.setDepth(10); // Ensure this battler is rendered above others
        }
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
            x: tile.sprite.x + tile.sprite.width / 2 - 4,
            y: tile.sprite.y + this.yOffset - 32
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
