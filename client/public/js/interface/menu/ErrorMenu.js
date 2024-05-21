import { BaseMenu } from './BaseMenu.js';

export default class ErrorMenu extends BaseMenu {
    constructor(scene, errorMessage) {
        const x = scene.sys.game.config.width / 2;
        const y = scene.sys.game.config.height / 2;
        const width = 400;
        const height = 200;
        const backgroundColor = 0x000000;
        const backgroundAlpha = 0.9;
        const borderRadius = 10;

        super(scene, x, y, width, height, backgroundColor, backgroundAlpha, borderRadius);

        this.errorMessage = errorMessage;
        this.createErrorMenu();
    }

    createErrorMenu() {
        // Add error message text area with bright red text
        this.addTextArea(this.x - this.width / 2 + 20, this.y - this.height / 2 + 20, this.width - 40, this.height - 80, this.errorMessage, { fontSize: '16px' }, 0, '#ff0000');

        // Add OK button
        this.addButton(this.x, this.y + this.height / 2 - 30, 80, 30, 'OK', () => this.hide(), null, 0, 0x555555, '#fff', 10);
    }
}
