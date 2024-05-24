import { BaseMenu } from './BaseMenu.js';
import ErrorMenu from '../../interface/menu/ErrorMenu.js';
import api from '../../api';

export default class UserRegistrationMenu extends BaseMenu {
    constructor(scene) {
        const x = scene.sys.game.config.width / 2;
        const y = scene.sys.game.config.height / 2;
        const width = 400;
        const height = 300;
        const backgroundColor = 0x000000;
        const backgroundAlpha = 0.8;
        const borderRadius = 10;

        super(scene, x, y, width, height, backgroundColor, backgroundAlpha, borderRadius);

        this.createRegistrationMenu();
    }

    createRegistrationMenu() {
        // Add account name text input
        const accountNameY = this.y - this.height / 3;
        this.addTextInput(this.x, accountNameY, 300, 40, 'Account Name');

        // Add password text input
        const passwordY = accountNameY + 60;
        this.addTextInput(this.x, passwordY, 300, 40, 'Password', 0, 50, true);

        // Add retype password text input
        const retypePasswordY = passwordY + 60;
        this.addTextInput(this.x, retypePasswordY, 300, 40, 'Retype Password', 0, 50, true);

        // Add Register button
        const buttonY = this.y + this.height / 3 + 10;
        this.addButton(this.x, buttonY, 100, 40, 'Register', () => this.handleRegister());

        // Add Cancel clickable text
        const cancelTextY = buttonY + 30;
        this.addClickableText(this.x + 120, cancelTextY - 20, 'Cancel', () => this.handleCancel(), { fontSize: '16px', fill: '#fff' });
    }

    handleRegister() {
        const accountName = this.getTextInputValue(0, 0);
        const password = this.getTextInputValue(0, 1);
        const retypePassword = this.getTextInputValue(0, 2);

        if (password !== retypePassword) {
            const errorMessage = 'Passwords do not match';
            const errorMenu = new ErrorMenu(this.scene, errorMessage);
            errorMenu.onClose = () => {
                this.show();
            };
            this.hideNoOnclose();
            errorMenu.show();
            return;
        }

        api.auth.createUser(accountName, password)
            .then(data => {
                console.log('User account created successfully:', data);
                // Hide the registration menu
                this.hide();

                // Proceed with post-registration logic (e.g., navigate to login menu or main menu)
                // For example: this.scene.start('LoginMenu');
            })
            .catch(error => {
                console.error('Error creating user account:', error);
                // Show error message
                const errorMessage = error.error || 'Error creating account';
                const errorMenu = new ErrorMenu(this.scene, errorMessage);
                errorMenu.onClose = () => {
                    this.show();
                };
                this.hideNoOnclose();
                errorMenu.show();
            });
    }

    handleCancel() {
        this.hide();
    }
}
