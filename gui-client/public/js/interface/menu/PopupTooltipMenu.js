import { BaseMenu } from './BaseMenu.js';

export default class PopupTooltipMenu extends BaseMenu {
    constructor(scene, x, y, iconKey, title, description) {
        const width = 300;
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
        this.addIcon(this.x - this.width / 2 + 20, this.y - this.height / 2 + 20, this.iconKey, null, 0, false);

        // Add title text area
        this.addTextArea(this.x - this.width / 2 + 60, this.y - this.height / 2 + 20, this.width - 80, 30, this.title, { fontSize: '18px', fill: '#ffcc00' });

        // Add description text area
        this.addTextArea(this.x - this.width / 2 + 60, this.y - this.height / 2 + 50, this.width - 80, 60, this.description, { fontSize: '14px', fill: '#ffffff' });
    }
}
