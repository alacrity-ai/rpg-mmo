import Phaser from 'phaser';

export function addBackgroundImage(scene, imageKey, width, height) {
    // Add the background image and ensure it fits the canvas
    const background = scene.add.image(0, 0, imageKey).setOrigin(0, 0);
    background.setDisplaySize(width, height);

    // Set the background texture to use nearest neighbor filtering
    scene.textures.get(imageKey).setFilter(Phaser.Textures.FilterMode.NEAREST);
}
