import { atlasToSprite } from '../graphics/AtlasTools.js';

class BattlerSpriteManager {
    static async loadSprite(scene, battlerData) {
        const spritePath = battlerData.spritePath;
        if (spritePath.endsWith('atlas.png')) {
            // Use AtlasTools to load the atlas and create an animation
            return await atlasToSprite(scene, spritePath);
        } else {
            // Load the image normally
            if (!scene.textures.exists(spritePath)) {
                await new Promise((resolve, reject) => {
                    scene.load.image(spritePath, spritePath);
                    scene.load.once('complete', resolve);
                    scene.load.once('loaderror', reject);
                    scene.load.start();
                });
            }
            return null; // No special config needed for single image sprites
        }
    }

    static createSprite(scene, battlerData, position, spriteConfig) {
        const { x, y } = position;

        if (spriteConfig) {
            // Create the sprite using the atlas animation
            const sprite = scene.add.sprite(x, y, spriteConfig.key);
            sprite.play(spriteConfig.animKey);
            return sprite;
        } else {
            // Create the sprite using a normal image
            const sprite = scene.add.sprite(x, y, battlerData.spritePath);

            // Create a 1-frame animation for consistency
            if (!scene.anims.exists(`${battlerData.spritePath}_anim`)) {
                scene.anims.create({
                    key: `${battlerData.spritePath}_anim`,
                    frames: [{ key: battlerData.spritePath }],
                    frameRate: 1,
                    repeat: -1
                });
            }
            sprite.play(`${battlerData.spritePath}_anim`);
            return sprite;
        }
    }
}

export default BattlerSpriteManager;
