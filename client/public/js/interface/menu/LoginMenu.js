import { BaseMenu } from './BaseMenu.js';
import ErrorMenu from '../../interface/menu/ErrorMenu.js';
import UserRegistrationMenu from './UserRegistrationMenu.js';
import CharacterSelectMenu from './CharacterSelectMenu.js'; // Import CharacterSelectMenu
import api from '../../api';

export default class LoginMenu extends BaseMenu {
    constructor(scene) {
        const x = scene.sys.game.config.width / 2;
        const y = scene.sys.game.config.height / 2;
        const width = 400;
        const height = 260;
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

        // Add clickable text for user registration
        const registerTextY = buttonY + 30;
        this.addClickableText(this.x + 80, registerTextY, 'New Account', () => this.showUserRegistrationMenu(), { fontSize: '16px', fill: '#fff' });
    }

    handleLogin() {
        const username = this.getTextInputValue(0, 0);
        const password = this.getTextInputValue(0, 1);

        api.auth.login(username, password)
            .then(data => {
                console.log('User logged in successfully:', data);
                // Store user ID in the Phaser registry
                this.scene.registry.set('userId', data.id);
                
                // Fetch character data
                api.character.characterList()
                    .then(characters => {
                        console.log('Characters:', characters);
                        // Create and show the character select menu
                        const characterSelectMenu = new CharacterSelectMenu(this.scene, characters);
                        characterSelectMenu.show();
                    })
                    .catch(error => {
                        console.error('Error fetching character list:', error);
                        // Show error message
                        const errorMessage = 'Failed to load character list';
                        const errorMenu = new ErrorMenu(this.scene, errorMessage);
                        errorMenu.onClose = () => {
                            this.show();
                        };
                        this.hideNoOnclose();
                        errorMenu.show();
                    });

                // Hide the login menu
                this.hide();
            })
            .catch(error => {
                console.error('Error logging in:', error);
                // Show error message
                const errorMessage = 'Invalid username or password';
                const errorMenu = new ErrorMenu(this.scene, errorMessage);
                errorMenu.onClose = () => {
                    this.show();
                };
                this.hideNoOnclose();
                errorMenu.show();
            });
    }

    showUserRegistrationMenu() {
        this.hide();
        const userRegistrationMenu = new UserRegistrationMenu(this.scene);
        userRegistrationMenu.onClose = () => {
            this.show();
        };
        userRegistrationMenu.show();
    }
}
