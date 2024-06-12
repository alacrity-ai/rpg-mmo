import AnimationScript from './AnimationScript.js';

class AssassinateScript extends AnimationScript {
    constructor(scene, battleGrid, usingBattler, targetBattler) {
        super(scene, battleGrid, usingBattler, targetBattler);
    }

    execute() {
        if (this.usingBattler.sprite && this.targetBattler.sprite) {
            // Hide the user temporarily
            this.usingBattler.sprite.visible = false;
            
            // Determine the position behind the targetBattler
            const behindPosition = { 
                x: this.targetBattler.sprite.x + 70,  // Adjust the offset as needed
                y: this.targetBattler.sprite.y - 20   // Adjust the offset as needed
            };

            // Create a duplicate of the usingBattler's sprite
            const assassinSprite = this.scene.add.sprite(behindPosition.x, behindPosition.y, this.usingBattler.sprite.texture.key);
            
            // Set the depth of the sprite to the targetBattler's depth
            assassinSprite.setDepth(this.targetBattler.sprite.depth);
            
            // Flip the duplicate sprite to face the target
            assassinSprite.setFlipX(true);

            // Set the same tint to the duplicate sprite as the original usingBattler
            assassinSprite.setTintFill(this.usingBattler.sprite.tintTopLeft, this.usingBattler.sprite.tintTopRight, this.usingBattler.sprite.tintBottomLeft, this.usingBattler.sprite.tintBottomRight);

            // Play the 'attack' animation once on the duplicate sprite
            const animKey = this.usingBattler.spriteConfigs['attack'].animKey;
            assassinSprite.anims.play({
                key: animKey,
                repeat: 0 // Override repeat setting to play the animation once
            });

            // Listen for the animation complete event once
            assassinSprite.once('animationcomplete', (animation, frame) => {
                if (animation.key === animKey) {
                    console.log(`Animation complete: ${animation.key}`);
                    assassinSprite.destroy();
                    this.usingBattler.sprite.visible = true;
                }
            });
        }
    }
}

export default AssassinateScript;
