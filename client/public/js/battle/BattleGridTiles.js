import Phaser from "phaser";

const applyDithering = (context, width, height, ditherAmount = 64) => {
    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const oldR = data[index];
            const oldG = data[index + 1];
            const oldB = data[index + 2];

            // Quantize the colors
            const newR = Math.round(oldR / ditherAmount) * ditherAmount;
            const newG = Math.round(oldG / ditherAmount) * ditherAmount;
            const newB = Math.round(oldB / ditherAmount) * ditherAmount;

            data[index] = newR;
            data[index + 1] = newG;
            data[index + 2] = newB;

            const quantErrorR = oldR - newR;
            const quantErrorG = oldG - newG;
            const quantErrorB = oldB - newB;

            if (x + 1 < width) {
                data[index + 4] += quantErrorR * 7 / 16;
                data[index + 5] += quantErrorG * 7 / 16;
                data[index + 6] += quantErrorB * 7 / 16;
            }
            if (y + 1 < height) {
                if (x > 0) {
                    data[index + width * 4 - 4] += quantErrorR * 3 / 16;
                    data[index + width * 4 - 3] += quantErrorG * 3 / 16;
                    data[index + width * 4 - 2] += quantErrorB * 3 / 16;
                }
                data[index + width * 4] += quantErrorR * 5 / 16;
                data[index + width * 4 + 1] += quantErrorG * 5 / 16;
                data[index + width * 4 + 2] += quantErrorB * 5 / 16;
                if (x + 1 < width) {
                    data[index + width * 4 + 4] += quantErrorR * 1 / 16;
                    data[index + width * 4 + 5] += quantErrorG * 1 / 16;
                    data[index + width * 4 + 6] += quantErrorB * 1 / 16;
                }
            }
        }
    }

    context.putImageData(imageData, 0, 0);
};

export const generateGradientTexture = (scene, startColor, endColor, alpha, border, borderColor, key, ditherAmount = 8) => {
    // Check if the texture already exists
    if (scene.textures.exists(key)) {
        console.log(`Texture key already in use: ${key}`);
        return;
    }
    
    const tileWidth = 84; // Default 96
    const tileHeight = 42; // Default 96
    const radius = 8; // Radius for rounded corners
    
    const tempKey = `${key}_temp`;
    const canvas = scene.textures.createCanvas(tempKey, tileWidth, tileHeight);
    const context = canvas.context;
    const gradient = context.createLinearGradient(0, 0, 0, tileHeight);

    gradient.addColorStop(0, Phaser.Display.Color.IntegerToColor(startColor).rgba);
    gradient.addColorStop(1, Phaser.Display.Color.IntegerToColor(endColor).rgba);

    context.fillStyle = gradient;
    context.beginPath();
    context.moveTo(radius, 0);
    context.lineTo(tileWidth - radius, 0);
    context.quadraticCurveTo(tileWidth, 0, tileWidth, radius);
    context.lineTo(tileWidth, tileHeight - radius);
    context.quadraticCurveTo(tileWidth, tileHeight, tileWidth - radius, tileHeight);
    context.lineTo(radius, tileHeight);
    context.quadraticCurveTo(0, tileHeight, 0, tileHeight - radius);
    context.lineTo(0, radius);
    context.quadraticCurveTo(0, 0, radius, 0);
    context.closePath();
    context.fill();

    if (border) {
        context.lineWidth = 2;
        context.strokeStyle = Phaser.Display.Color.IntegerToColor(borderColor).rgba;
        context.beginPath();
        context.moveTo(radius, 0);
        context.lineTo(tileWidth - radius, 0);
        context.quadraticCurveTo(tileWidth, 0, tileWidth, radius);
        context.lineTo(tileWidth, tileHeight - radius);
        context.quadraticCurveTo(tileWidth, tileHeight, tileWidth - radius, tileHeight);
        context.lineTo(radius, tileHeight);
        context.quadraticCurveTo(0, tileHeight, 0, tileHeight - radius);
        context.lineTo(0, radius);
        context.quadraticCurveTo(0, 0, radius, 0);
        context.closePath();
        context.stroke();
    }

    // Apply dithering effect
    applyDithering(context, tileWidth, tileHeight, ditherAmount);

    canvas.refresh();

    // Add the canvas texture to the texture manager with the correct key
    scene.textures.addCanvas(key, canvas.canvas);
    
    // Remove the temporary key
    scene.textures.remove(tempKey);

    // Set the texture filter mode to NEAREST
    scene.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
};

// Generate texture with gold or red border for selected tile
export const generateBorderTexture = (scene, startColor, endColor, alpha, key, borderColor, ditherAmount = 8) => {
    generateGradientTexture(scene, startColor, endColor, alpha, true, borderColor, key, ditherAmount);
};
