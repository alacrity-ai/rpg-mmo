import BattlerSpriteManager from './BattlerSpriteManager.js';

class Battler {
    constructor(scene, battlerData, initialTile, isThisPlayer = false, scale = 1) {
        this.scene = scene;
        this.battlerData = battlerData;
        this.initialTile = initialTile;
        this.sprite = null;
        this.moving = false;
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

    playAnimationOnce(animationName) {
        const validAnimations = ['attack', 'cast', 'combat', 'die', 'hit', 'idle', 'run'];
        if (this.sprite && validAnimations.includes(animationName)) {
            const animKey = this.spriteConfigs[animationName].animKey;
            console.log(`Playing animation once: ${animationName}, animKey: ${animKey}, spriteConfigs: ${this.spriteConfigs}`);
    
            // Ensure any previous event listener is removed to prevent multiple triggers
            this.sprite.off('animationcomplete');
    
            // Play the animation once by temporarily creating a new animation configuration
            this.sprite.anims.play({
                key: animKey,
                repeat: 0 // Override repeat setting to play the animation once
            });
    
            // Listen for the animation complete event once
            this.sprite.once('animationcomplete', (animation, frame) => {
                if (animation.key === animKey) {
                    console.log(`Animation complete: ${animation.key}`);
                    // Optionally reset to idle animation after the animation completes
                    this.sprite.play(this.spriteConfigs['combat'].animKey);
                }
            });
        }
    }

    playAnimationAndStopOnLastFrame(animationName) {
        const validAnimations = ['attack', 'cast', 'combat', 'die', 'hit', 'idle', 'run'];
        if (this.sprite && validAnimations.includes(animationName)) {
            const animKey = this.spriteConfigs[animationName].animKey;
            console.log(`Playing animation and stopping on last frame: ${animationName}, animKey: ${animKey}, spriteConfigs: ${this.spriteConfigs}`);
    
            // Ensure any previous event listener is removed to prevent multiple triggers
            this.sprite.off('animationcomplete');
    
            // Play the animation
            this.sprite.play(animKey);
    
            // Listen for the animation complete event once
            this.sprite.once('animationcomplete', (animation, frame) => {
                if (animation.key === animKey) {
                    console.log(`Animation complete: ${animation.key}`);
    
                    // Get the last frame of the animation
                    const lastFrame = this.sprite.anims.get(animKey).getLastFrame();
    
                    // Stop the animation on the last frame
                    this.sprite.anims.stopOnFrame(lastFrame);
                }
            });
        }
    }    

    playHitAnimation(amount) {
        if (this.sprite) {
            // Play the 'hit' animation once
            this.playAnimationOnce('hit');
    
            // Flash the sprite white for a brief moment
            this.scene.tweens.add({
                targets: this.sprite,
                alpha: { from: 1, to: 0 },
                duration: 50,
                yoyo: true,
                repeat: 3
            });
    
            if (!this.moving) {
                // Tween to knock the sprite back and then return to original position
                const originalPosition = { x: this.sprite.x, y: this.sprite.y };
                const knockbackDistance = 10; // Adjust the knockback distance as needed
        
                // Determine the direction of the knockback
                const knockbackDirection = (this.battlerData.team === 'player') ? -1 : 1;
                
                this.scene.tweens.add({
                    targets: this.sprite,
                    x: originalPosition.x + knockbackDistance * knockbackDirection,
                    duration: 100,
                    yoyo: true,
                    onComplete: () => {
                        this.sprite.setPosition(originalPosition.x, originalPosition.y); // Ensure it returns to the exact original position
                    }
                });
            }

            // Render floating damage text if amount is provided
            if (amount !== null) {
                this.renderFloatingDamageText(amount);
            }
        }
    }

    playHealAnimation(healing = 10) {
        if (this.sprite) {
            this.scene.tweens.add({
                targets: this.sprite,
                tint: { from: 0xffffff, to: 0x00ff00 },
                duration: 100,
                yoyo: true,
                repeat: 3,
                onComplete: () => {
                    this.sprite.clearTint();
                }
            });

            if (healing !== null) {
                this.renderFloatingHealingText(healing);
            }
        }
    }

    playNpcDeathAnimation() {
        if (this.sprite) {
            // Split into two and separate into two directions on the x-axis while fading out
            const originalPosition = { x: this.sprite.x, y: this.sprite.y };
            const splitDistance = 60; // Adjust the split distance as needed
            const knockbackDistance = 10; // Adjust the knockback distance as needed
    
            // Create three sprites for the split animation
            const spriteLeft = this.scene.add.sprite(originalPosition.x, originalPosition.y, this.sprite.texture.key);
            const spriteMiddle = this.scene.add.sprite(originalPosition.x, originalPosition.y, this.sprite.texture.key);
            const spriteRight = this.scene.add.sprite(originalPosition.x, originalPosition.y, this.sprite.texture.key);
    
            // Set the same tint to all sprites as the original sprite
            spriteLeft.setTintFill(this.sprite.tintTopLeft, this.sprite.tintTopRight, this.sprite.tintBottomLeft, this.sprite.tintBottomRight);
            spriteMiddle.setTintFill(this.sprite.tintTopLeft, this.sprite.tintTopRight, this.sprite.tintBottomLeft, this.sprite.tintBottomRight);
            spriteRight.setTintFill(this.sprite.tintTopLeft, this.sprite.tintTopRight, this.sprite.tintBottomLeft, this.sprite.tintBottomRight);
    
            // Flash the middle sprite red briefly and knock it back
            this.scene.tweens.add({
                targets: spriteMiddle,
                tint: { from: 0xffffff, to: 0xff0000 },
                x: originalPosition.x + knockbackDistance,
                duration: 140,
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    spriteMiddle.clearTint();
    
                    // Fade out the middle sprite
                    this.scene.tweens.add({
                        targets: spriteMiddle,
                        alpha: { from: 1, to: 0 },
                        duration: 500,
                        onComplete: () => {
                            spriteMiddle.destroy();
                        }
                    });
                }
            });
    
            // Tween to move both left and right sprites in opposite directions and fade out
            this.scene.tweens.add({
                targets: spriteLeft,
                x: originalPosition.x - splitDistance,
                alpha: { from: 1, to: 0 },
                duration: 500,
                onComplete: () => {
                    spriteLeft.destroy();
                }
            });
    
            this.scene.tweens.add({
                targets: spriteRight,
                x: originalPosition.x + splitDistance,
                alpha: { from: 1, to: 0 },
                duration: 500,
                onComplete: () => {
                    spriteRight.destroy();
                }
            });
    
            // Destroy the original sprite immediately
            this.sprite.destroy();
        }
    }
    
       

    die() {
        if (this.battlerData.team === 'player') {
            if (this.sprite) {
                this.playAnimationAndStopOnLastFrame('die');
            }
        } else {
            if (this.sprite) {
                this.playNpcDeathAnimation();
            }
        }
    }

    renderBattleText(text, color = '#ffffff', yOffset = 50, duration = 1500) {
        const textStyle = {
            font: '20px Arial',
            fill: color,
            stroke: '#000000',
            strokeThickness: 3
        };

        const battleText = this.scene.add.text(this.sprite.x, this.sprite.y - yOffset, text, textStyle)
            .setOrigin(0.5)
            .setDepth(100);

        this.scene.tweens.add({
            targets: battleText,
            y: this.sprite.y - yOffset - 70, // Move up
            alpha: { from: 1, to: 0 },
            duration: duration,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                battleText.destroy();
            }
        });
    }

    renderFloatingDamageText(damage) {
        const textColor = this.battlerData.team === 'player' ? '#ff0000' : '#ffffff';
        this.renderBattleText(damage, textColor);
    }

    renderFloatingHealingText(healing) {
        const textColor = '#00ff00';
        this.renderBattleText(healing, textColor);
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
    
        // Set to moving
        this.moving = true;

        this.scene.tweens.add({
            targets: this.sprite,
            x: position.x,
            y: position.y,
            duration: 500,
            onComplete: () => {
                // Play the 'combat' animation once the movement is complete
                this.playAnimation('combat');
                battleGrid.moveBattler(this.battlerData.id, newTile);
                this.moving = false;
            }
        });
    }
}

export default Battler;
