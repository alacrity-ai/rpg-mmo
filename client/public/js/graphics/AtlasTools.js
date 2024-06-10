export async function atlasToSprite(scene, atlasImagePath, frameRate = 10, startingFrame = 0) {
    const atlasKey = atlasImagePath; // Use the image path as the unique key for the atlas
    const atlasJsonPath = atlasImagePath.replace('atlas.png', 'atlas.json'); // Replace the PNG extension with JSON

    return new Promise((resolve, reject) => {
        // Check if the texture is already loaded
        if (scene.textures.exists(atlasKey)) {
            let frames = scene.textures.get(atlasKey).getFrameNames().map(frameName => ({
                key: atlasKey,
                frame: frameName
            }));

            // Rearrange the frames based on the starting frame
            if (startingFrame > 0) {
                frames = frames.slice(startingFrame).concat(frames.slice(0, startingFrame));
            }

            if (!scene.anims.exists(`${atlasKey}_anim`)) {
                scene.anims.create({
                    key: `${atlasKey}_anim`,
                    frames: frames,
                    frameRate: frameRate,
                    repeat: -1 // Set to -1 to loop indefinitely
                });
            }

            const spriteConfig = { key: atlasKey, animKey: `${atlasKey}_anim` };
            resolve(spriteConfig);
            return;
        }

        scene.load.atlas(atlasKey, atlasImagePath, atlasJsonPath);

        scene.load.once('complete', () => {
            // Set the filter mode to NEAREST for pixel-perfect rendering
            scene.textures.get(atlasKey).setFilter(Phaser.Textures.FilterMode.NEAREST);

            let frames = scene.textures.get(atlasKey).getFrameNames().map(frameName => ({
                key: atlasKey,
                frame: frameName
            }));

            // Rearrange the frames based on the starting frame
            if (startingFrame > 0) {
                frames = frames.slice(startingFrame).concat(frames.slice(0, startingFrame));
            }

            scene.anims.create({
                key: `${atlasKey}_anim`,
                frames: frames,
                frameRate: frameRate,
                repeat: -1 // Set to -1 to loop indefinitely
            });

            const spriteConfig = { key: atlasKey, animKey: `${atlasKey}_anim` };
            resolve(spriteConfig);
        });

        scene.load.once('loaderror', () => {
            reject(new Error(`Failed to load atlas: ${atlasImagePath} or ${atlasJsonPath}`));
        });

        scene.load.start();
    });
}
