// interface/menu/DialogueMenu.js

import { BaseMenu } from './BaseMenu.js';

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
        // Add portrait at the top
        const portraitY = this.y - this.height / 2 + (this.height / 4);
        await this.addPortrait(this.x, portraitY, this.atlasImagePath);

        // Add text area below the graphic
        const textY = graphicY + (this.height / 4) + 10; // 10px padding between graphic and text
        this.addTextArea(this.x - this.width / 2 + 20, textY, this.width - 40, this.height / 4, this.textContent, { fontSize: '16px', fill: '#fff' });

        // Add OK button at the bottom
        const buttonY = this.y + this.height / 2 - 30;
        this.addButton(this.x, buttonY, 80, 30, 'OK', () => this.hide(), null, 0, 0x555555, '#fff', 10);
    }
}
