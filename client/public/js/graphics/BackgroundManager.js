import Phaser from 'phaser';

export function addBackgroundImage(scene, imageKey, width, height, x = 0, y = 0, isBattle = false) {
    // Add the background image and ensure it fits the canvas
    const background = scene.add.image(x, y, imageKey).setOrigin(0, 0);
    background.setDisplaySize(width, height);

    // Set the background texture to use nearest neighbor filtering
    scene.textures.get(imageKey).setFilter(Phaser.Textures.FilterMode.NEAREST);

    if (isBattle) {
        // Create a graphics object for the gradient
        const gradientTexture = scene.textures.createCanvas('gradient', width, height);
        const ctx = gradientTexture.getContext();

        // Create gradient
        const grd = ctx.createLinearGradient(0, height, 0, 0);
        grd.addColorStop(0, 'rgba(0, 0, 0, 1)'); // Fully black at the bottom
        grd.addColorStop(0.3, 'rgba(0, 0, 0, 1)'); // Fully black halfway up
        grd.addColorStop(0.4, 'rgba(0, 0, 0, 0.8)'); // Half transparent at 50% height
        grd.addColorStop(0.5, 'rgba(0, 0, 0, 0.7)'); // Half transparent at 50% height
        grd.addColorStop(0.75, 'rgba(0, 0, 0, 0.5)'); // Dark at 75% height
        grd.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Fully transparent at the top

        // Apply gradient to canvas
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, width, height);

        gradientTexture.refresh();
        
        // Add the gradient texture to the scene
        const gradientImage = scene.add.image(0, 0, 'gradient').setOrigin(0, 0);
        gradientImage.setDisplaySize(width, height);
    }
}
