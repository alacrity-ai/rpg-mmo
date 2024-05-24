import { BaseMenu } from './BaseMenu.js';

export default class PopupTooltipMenu extends BaseMenu {
    constructor(scene, x, y, iconKey, title, description) {
        const width = 220;
        const height = 150;
        const backgroundColor = 0x000000;
        const backgroundAlpha = 0.8;
        const borderRadius = 10;

        super(scene, x, y, width, height, backgroundColor, backgroundAlpha, borderRadius);

        this.iconKey = iconKey;
        this.title = title;
        this.description = description;

        this.createPopup();
    }

    createPopup() {
        // Add icon without border
        this.addIcon(this.x - this.width / 2 + 25, this.y - this.height / 2 + 25, this.iconKey, null, 0, false);

        // Add title text area
        this.addTextArea(this.x - this.width / 2 + 50, this.y - this.height / 2 + 10, this.width - 40, 30, this.title, { fontSize: '18px', fill: '#ffcc00' });

        // Add description text area
        this.addTextArea(this.x - this.width / 2 + 30, this.y - this.height / 2 + 50, this.width - 40, 60, this.description, { fontSize: '14px', fill: '#ffffff' });
    }
}
