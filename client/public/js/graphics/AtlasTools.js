export async function atlasToSprite(scene, atlasImagePath, frameRate = 10) {
    const atlasKey = Phaser.Utils.String.UUID(); // Generate a unique key for the atlas
    const atlasJsonPath = atlasImagePath.replace('atlas.png', 'atlas.json'); // Replace the PNG extension with JSON

    return new Promise((resolve, reject) => {
        scene.load.atlas(atlasKey, atlasImagePath, atlasJsonPath);

        scene.load.once('complete', () => {
            const frames = scene.textures.get(atlasKey).getFrameNames().map(frameName => ({
                key: atlasKey,
                frame: frameName
            }));

            scene.anims.create({
                key: `${atlasKey}_anim`,
                frames: frames,
                frameRate: frameRate,
                repeat: -1 // Set to -1 to loop indefinitely
            });

            // Create the sprite without adding it to the scene
            const spriteConfig = { key: atlasKey, animKey: `${atlasKey}_anim` };
            resolve(spriteConfig);
        });

        scene.load.once('loaderror', () => {
            reject(new Error(`Failed to load atlas: ${atlasImagePath} or ${atlasJsonPath}`));
        });

        scene.load.start();
    });
}
