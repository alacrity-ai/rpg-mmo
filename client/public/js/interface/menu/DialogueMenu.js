import { BaseMenu } from './BaseMenu.js';
import { atlasToSprite } from '../../graphics/AtlasTools.js';

export default class DialogueMenu extends BaseMenu {
    constructor(scene, atlasImagePath, textContent, width = 400, height = 300) {
        const x = scene.sys.game.config.width / 2;
        const y = scene.sys.game.config.height / 2;
        const backgroundColor = 0x000000;
        const backgroundAlpha = 0.8;
        const borderRadius = 10;

        super(scene, x, y, width, height, backgroundColor, backgroundAlpha, borderRadius);

        this.atlasImagePath = atlasImagePath;
        this.textContent = textContent;
        this.createDialogueMenu();
    }

    async createDialogueMenu() {
        // Add graphic or animation centered at the top
        const graphicY = this.y - this.height / 2 + (this.height / 4);
        try {
            const spriteConfig = await atlasToSprite(this.scene, this.atlasImagePath);

            // Create the sprite and add it to the scene
            const sprite = this.scene.add.sprite(this.x, graphicY, spriteConfig.key).play(spriteConfig.animKey);
            this.addElementToTab(0, sprite);

            // Create a rounded white border above the sprite
            const spriteWidth = sprite.displayWidth;
            const spriteHeight = sprite.displayHeight;
            const borderRadius = 10;

            // Create the mask shape (rounded rectangle)
            const maskShape = this.scene.add.graphics();
            maskShape.fillStyle(0xffffff, 1);
            maskShape.fillRoundedRect(this.x - spriteWidth / 2, graphicY - spriteHeight / 2, spriteWidth, spriteHeight, borderRadius);

            // Create a mask from the shape and apply it to the sprite
            const mask = maskShape.createGeometryMask();
            sprite.setMask(mask);

            // Hide the mask shape itself (it's only needed for the mask)
            maskShape.setVisible(false);

            // Create the border graphics
            const border = this.scene.add.graphics();
            border.lineStyle(2, 0xffffff, 1);
            border.strokeRoundedRect(this.x - spriteWidth / 2, graphicY - spriteHeight / 2, spriteWidth, spriteHeight, borderRadius);

            // Ensure the border is above the sprite
            border.depth = sprite.depth + 1;
            this.addElementToTab(0, border);
        } catch (error) {
            console.error('Error loading graphic:', error);
        }

        // Add text area below the graphic
        const textY = graphicY + (this.height / 4) + 10; // 10px padding between graphic and text
        this.addTextArea(this.x - this.width / 2 + 20, textY, this.width - 40, this.height / 4, this.textContent, { fontSize: '16px', fill: '#fff' });

        // Add OK button at the bottom
        const buttonY = this.y + this.height / 2 - 30;
        this.addButton(this.x, buttonY, 80, 30, 'OK', () => this.hide(), null, 0, 0x555555, '#fff', 10);
    }
}
