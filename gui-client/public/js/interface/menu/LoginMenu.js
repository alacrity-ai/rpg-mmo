import { BaseMenu } from './BaseMenu.js';

export default class LoginMenu extends BaseMenu {
    constructor(scene) {
        const x = scene.sys.game.config.width / 2;
        const y = scene.sys.game.config.height / 2;
        const width = 400;
        const height = 220;
        const backgroundColor = 0x000000;
        const backgroundAlpha = 0.8;
        const borderRadius = 10;

        super(scene, x, y, width, height, backgroundColor, backgroundAlpha, borderRadius);

        this.createLoginMenu();
    }

    createLoginMenu() {
        // Add username text input
        const usernameY = this.y - this.height / 4;
        this.addTextInput(this.x, usernameY, 300, 40, 'Username');

        // Add password text input
        const passwordY = usernameY + 60;
        this.addTextInput(this.x, passwordY, 300, 40, 'Password', 0, 50, true);

        // Add Login button
        const buttonY = this.y + this.height / 4 + 10;
        this.addButton(this.x, buttonY, 100, 40, 'Login', () => this.handleLogin());
    }

    handleLogin() {
        const username = this.getTextInputValue(0, 0);
        const password = this.getTextInputValue(0, 1);
        this.hide();
    }
}
