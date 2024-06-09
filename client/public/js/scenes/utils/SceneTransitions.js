// scenes/utils/SceneTransitions.js
export function fadeTransition(currentScene, newSceneKey, speed = 500, color = 0x000000) {
    // Create a rectangle that covers the entire screen
    let width = currentScene.cameras.main.width;
    let height = currentScene.cameras.main.height;

    // Create a rectangle with the specified color and set its alpha to 0 (invisible)
    let fadeRect = currentScene.add.rectangle(width / 2, height / 2, width, height, color).setAlpha(0);

    // Create a tween to fade in the rectangle (fade out current scene)
    currentScene.tweens.add({
        targets: fadeRect,
        alpha: 1,
        duration: speed,
        onComplete: () => {
            // Run the previous scene cleanup logic
            currentScene.cleanup();

            // Emit a global event to notify scene change including the new scene key
            currentScene.game.events.emit('changeScene', newSceneKey);

            // When the fade out is complete, start the new scene
            currentScene.scene.start(newSceneKey);
            // Add the fade-in effect to the new scene
            currentScene.scene.get(newSceneKey).events.once('create', (newScene) => {
                // Create a fade-in rectangle in the new scene with the same color
                let fadeRectNewScene = newScene.add.rectangle(width / 2, height / 2, width, height, color).setAlpha(1);
                
                newScene.tweens.add({
                    targets: fadeRectNewScene,
                    alpha: 0,
                    duration: speed,
                    onComplete: () => {
                        // Destroy the rectangle after the fade-in is complete
                        fadeRectNewScene.destroy();
                    }
                });
            });
        }
    });
}

export function wipeTransition(currentScene, newSceneKey, speed = 500) {
    let width = currentScene.cameras.main.width;
    let height = currentScene.cameras.main.height;

    // Create a black rectangle at the left edge of the screen
    let wipeRect = currentScene.add.rectangle(0, height / 2, 0, height, 0x000000).setOrigin(0, 0.5);

    // Create a tween to slide the rectangle across the screen (wipe out current scene)
    currentScene.tweens.add({
        targets: wipeRect,
        width: width,
        duration: speed,
        ease: 'Power1',
        onComplete: () => {
            // When the wipe out is complete, start the new scene
            currentScene.scene.start(newSceneKey);

            // Add the wipe-in effect to the new scene
            currentScene.scene.get(newSceneKey).events.once('create', (newScene) => {
                // Move the rectangle to the right edge of the screen in the new scene
                wipeRect.setPosition(width, height / 2).setOrigin(1, 0.5);

                // Create a tween to slide the rectangle out of the screen (wipe in new scene)
                newScene.tweens.add({
                    targets: wipeRect,
                    width: 0,
                    duration: speed,
                    ease: 'Power1',
                    onComplete: () => {
                        // Destroy the black rectangle after the wipe-in is complete
                        wipeRect.destroy();
                    }
                });
            });
        }
    });
}

// scenes/utils/SceneTransitions.js
export function pixelateTransition(currentScene, newSceneKey, duration = 500) {
    // Add a pixelate post-process pipeline to the current scene
    let pixelatePipeline = currentScene.cameras.main.postFX.addPixelate(1);

    // Create a tween to increase the pixel size (pixelate out current scene)
    currentScene.tweens.add({
        targets: pixelatePipeline,
        pixelSize: { from: 1, to: 50 },
        duration: duration / 2,
        ease: 'Sine.easeInOut', // Use an easing function for smoother transition
        onComplete: () => {
            // When the pixelate out is complete, start the new scene
            currentScene.scene.start(newSceneKey);

            // Add the pixelate-in effect to the new scene
            currentScene.scene.get(newSceneKey).events.once('create', (newScene) => {
                let newPixelatePipeline = newScene.cameras.main.postFX.addPixelate(50);
                newScene.tweens.add({
                    targets: newPixelatePipeline,
                    pixelSize: { from: 50, to: 1 },
                    duration: duration / 2,
                    ease: 'Sine.easeInOut', // Use an easing function for smoother transition
                    onComplete: () => {
                        // Remove the pixelate pipeline after the pixelate-in is complete
                        newScene.cameras.main.postFX.remove(newPixelatePipeline);
                    }
                });
            });

            // Remove the pixelate pipeline from the current scene
            currentScene.cameras.main.postFX.remove(pixelatePipeline);
        }
    });
}

export function zoomTransition(currentScene, newSceneKey, speed = 500, targetX = null, targetY = null) {
    let width = currentScene.cameras.main.width;
    let height = currentScene.cameras.main.height;

    // Create a black rectangle that covers the entire screen
    let fadeRect = currentScene.add.rectangle(width / 2, height / 2, width, height, 0x000000).setAlpha(0);

    // Determine the target zoom coordinates
    if (targetX !== null && targetY !== null) {
        currentScene.cameras.main.pan(targetX, targetY, speed, 'Power2');
    }

    // Create a tween to zoom in the camera (zoom in current scene)
    currentScene.tweens.add({
        targets: currentScene.cameras.main,
        zoom: 2, // Adjust zoom level as needed
        duration: speed,
        ease: 'linear',
        onComplete: () => {
            // When the zoom in is complete, fade out to black
            currentScene.tweens.add({
                targets: fadeRect,
                alpha: 1,
                duration: speed / 2,
                onComplete: () => {
                    // When the fade out is complete, start the new scene
                    currentScene.scene.start(newSceneKey);

                    // Add the fade-in effect to the new scene
                    currentScene.scene.get(newSceneKey).events.once('create', (newScene) => {
                        // Create a fade-in rectangle in the new scene
                        let fadeRectNewScene = newScene.add.rectangle(width / 2, height / 2, width, height, 0x000000).setAlpha(1);
                        
                        newScene.tweens.add({
                            targets: fadeRectNewScene,
                            alpha: 0,
                            duration: speed,
                            onComplete: () => {
                                // Destroy the black rectangle after the fade-in is complete
                                fadeRectNewScene.destroy();
                            }
                        });

                        // Reset the zoom level of the new scene camera
                        newScene.cameras.main.zoom = 1;
                        // Reset the camera position if it was panned
                        if (targetX !== null && targetY !== null) {
                            newScene.cameras.main.centerOn(width / 2, height / 2);
                        }
                    });
                }
            });
        }
    });
}



