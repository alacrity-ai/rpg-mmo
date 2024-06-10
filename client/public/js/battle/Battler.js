import BattlerSpriteManager from './BattlerSpriteManager.js';

class Battler {
    constructor(scene, battlerData, initialTile, isThisPlayer = false, scale = 1) {
        this.scene = scene;
        this.battlerData = battlerData;
        this.initialTile = initialTile;
        this.sprite = null;
        if (battlerData.team === 'player') {
            this.yOffset = -20;
        } else {
            this.yOffset = 4;
        }
        this.scale = scale;
        if (scale === 1) {
            this.yAdjustment = 32;
        } else if (scale == 0.75) {
            this.yAdjustment = 12;
        } else {
            this.yAdjustment = 0;
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
            y: tile.sprite.y + this.yOffset - this.yAdjustment
        };
        this.sprite = BattlerSpriteManager.createSprite(this.scene, this.battlerData, position, this.spriteConfigs, this.scale); // Added scale parameter

        battleGrid.addBattlerToTile(this.battlerData.id, this.initialTile);
    }

    playAnimation(animationName, reverse = false) {
        const validAnimations = ['attack', 'cast', 'combat', 'die', 'hit', 'idle', 'run'];
        if (this.sprite && validAnimations.includes(animationName)) {
            const animKey = this.spriteConfigs[animationName].animKey;
            console.log(`Playing animation: ${animationName}, animKey: ${animKey}, spriteConfigs: ${this.spriteConfigs}`);
            
            if (reverse) {
                this.sprite.anims.playReverse(animKey);
            } else {
                this.sprite.play(animKey);
            }
        }
    }
    
    moveToTile(newTile, battleGrid) {
        const [newX, newY] = newTile;
        const tile = battleGrid.grid[newY][newX];
        
        // Calculate the position to center the sprite in the tile
        const position = {
            x: tile.sprite.x + tile.sprite.width / 2 - 4,
            y: tile.sprite.y + this.yOffset - this.yAdjustment
        };
        
        // Get the current tile position of the sprite using battleGrid.getBattlerPosition
        const [currentX, currentY] = battleGrid.getBattlerPosition(this.battlerData.id);
    
        // Check if we are moving left
        const isMovingLeft = newX < currentX;
    
        // Play the 'run' animation, reversed if moving left
        this.playAnimation('run', isMovingLeft);
    
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
