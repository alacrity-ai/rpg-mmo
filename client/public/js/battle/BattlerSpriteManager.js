import { atlasToSprite } from '../graphics/AtlasTools.js';

class BattlerSpriteManager {
    static async loadSprites(scene, battlerData) {
        const basePath = battlerData.spritePath;
        const animationTypes = ['attack', 'cast', 'combat', 'die', 'hit', 'idle', 'run'];
        const spriteConfigs = {};

        for (const animationType of animationTypes) {
            const spritePath = `${basePath}/${animationType}/atlas.png`;
            // Use AtlasTools to load the atlas and create an animation
            const spriteConfig = await atlasToSprite(scene, spritePath);
            spriteConfigs[animationType] = spriteConfig;
        }

        return spriteConfigs;
    }

    static createSprite(scene, battlerData, position, spriteConfigs, scale = 1, animationType = 'combat') {
        const { x, y } = position;
        const spriteConfig = spriteConfigs[animationType];
    
        if (spriteConfig) {
            // Create the sprite using the atlas animation
            const sprite = scene.add.sprite(x, y, spriteConfig.key);
            sprite.setScale(scale); // Set the scale of the sprite
            sprite.play(spriteConfig.animKey);
            return sprite;
        } else {
            // Fallback to combat animation if the requested animation type does not exist
            const fallbackSpriteConfig = spriteConfigs['combat'];
            const sprite = scene.add.sprite(x, y, fallbackSpriteConfig.key);
            sprite.setScale(scale); // Set the scale of the sprite
            sprite.play(fallbackSpriteConfig.animKey);
            return sprite;
        }
    }
    
}

export default BattlerSpriteManager;
