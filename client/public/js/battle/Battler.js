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
        this.spriteConfigs = await BattlerSpriteManager.loadSprites(this.scene, this.battlerData);
    }

    create(battleGrid) {
        const [x, y] = this.initialTile;
        const tile = battleGrid.grid[y][x];
        // Calculate the position to center the sprite in the tile
        const position = {
            x: tile.sprite.x + tile.sprite.width / 2 - 4,
            y: tile.sprite.y + this.yOffset - 32
        };
        this.sprite = BattlerSpriteManager.createSprite(this.scene, this.battlerData, position, this.spriteConfigs);
        // If renderAboveOthers is true, set the depth to a higher value
        if (this.renderAboveOthers) {
            this.sprite.setDepth(10); // Ensure this battler is rendered above others
        }
        battleGrid.addBattlerToTile(this.battlerData.id, this.initialTile);
    }

    playAnimation(animationName) {
        const validAnimations = ['attack', 'cast', 'combat', 'die', 'hit', 'idle', 'run'];
        if (this.sprite && validAnimations.includes(animationName)) {
            console.log(`Playing animation: ${animationName}, animKey: ${this.spriteConfigs[animationName].animKey}, spriteConfigs: ${this.spriteConfigs}`)
            this.sprite.play(this.spriteConfigs[animationName].animKey);
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
        
        // Play the 'run' animation
        this.playAnimation('run');

        this.scene.tweens.add({
            targets: this.sprite,
            x: position.x,
            y: position.y,
            duration: 500,
            onComplete: () => {
                // Play the 'combat' animation once the movement is complete
                this.playAnimation('combat');
                battleGrid.moveBattler(this.battlerData.id, newTile);
            }
        });
    }
}

export default Battler;
