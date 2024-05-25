import { BaseMenu } from './BaseMenu.js';
import CharacterCreateMenu from './CharacterCreateMenu.js';
import api from '../../api';

export default class CharacterSelectMenu extends BaseMenu {
    constructor(scene, width = 700, height = 500) { // Adjusted width and height for better layout
        const x = scene.sys.game.config.width / 2;
        const y = scene.sys.game.config.height / 2;
        const backgroundColor = 0x000000;
        const backgroundAlpha = 0.8;
        const borderRadius = 10;

        super(scene, x, y, width, height, backgroundColor, backgroundAlpha, borderRadius);

        this.characterData = []; // Initialize with an empty array

        this.loadCharacterData();
    }

    async loadCharacterData() {
        try {
            const characters = await api.character.characterList();
            console.log('Characters:', characters);
            this.characterData = characters;
            this.createCharacterSelectMenu(); // Create the menu after fetching the data
        } catch (error) {
            console.error('Error fetching character list:', error);
            // Show error message
            const errorMessage = 'Failed to load character list';
            const errorMenu = new ErrorMenu(this.scene, errorMessage);
            errorMenu.onClose = () => {
                this.scene.scene.start('LoginScene'); // Go back to the login menu on error
            };
            this.hideNoOnclose();
            errorMenu.show();
        }
    }

    async createCharacterSelectMenu() {
        const colWidth = this.width / 6; // Each column width based on the number of columns
        const rowHeight = 200;
        const startX = this.x - this.width / 2 + colWidth / 2;
        const startY = this.y - this.height / 2 + rowHeight / 2 - 20; // Start position with some padding

        for (let i = 0; i < this.characterData.length && i < 12; i++) { // Limit to 12 characters
            const character = this.characterData[i];
            const col = i % 6;
            const row = Math.floor(i / 6);
            const posX = startX + col * colWidth;
            const posY = startY + row * rowHeight;
            const atlasImagePath = `assets/images/characters/${character.characterClass}/portrait/atlas.png`;

            // Add character portrait with login callback
            const startingFrame = Phaser.Math.Between(1, 10);
            await this.addPortrait(posX, posY, atlasImagePath, 0, () => this.handleCharacterLogin(character.name), startingFrame);
            
            // Add character name below the portrait
            this.addText(posX, posY + 64, character.name, { fontSize: '16px', fill: '#fff' });

            // Add character class below the name
            this.addText(posX, posY + 84, character.characterClass, { fontSize: '14px', fill: '#ccc' });

            // Add character level below the class
            this.addText(posX, posY + 104, `Level ${character.level || 1}`, { fontSize: '14px', fill: '#ccc' });
        }

        // Add "New Character" button if there are fewer than 12 characters
        if (this.characterData.length < 12) {
            const newCharacterCol = this.characterData.length % 6;
            const newCharacterRow = Math.floor(this.characterData.length / 6);
            const newPosX = startX + newCharacterCol * colWidth;
            const newPosY = startY + newCharacterRow * rowHeight;

            this.addButton(newPosX, newPosY, 100, 40, 'New', () => this.handleNewCharacter());
        }

        // Add a "Back" button at the bottom to go back to the previous menu
        const buttonY = this.y + this.height / 2 - 30;
        this.addButton(this.x, buttonY, 100, 40, 'Logout', () => this.handleBack());
    }

    handleCharacterLogin(characterName) {
        api.character.loginCharacter(characterName)
            .then(data => {
                console.log('Character logged in successfully:', data);
                this.scene.scene.get('LoginScene').cleanup();
                this.scene.scene.start('TownScene');
                this.hide()
            })
            .catch(error => {
                console.error('Error logging in character:', error);
                // Optionally, you can show an error message here
            });
    }

    handleBack() {
        this.scene.scene.start('PreloaderScene');
        // Implement logic to go back to the previous menu or scene
        // For example: this.scene.start('MainMenu');
    }

    handleNewCharacter() {
        // Implement logic to create a new character
        console.log('New Character button clicked');
        // Switch to CharacterSelectMenu
        const characterCreateMenu = new CharacterCreateMenu(this.scene);
        characterCreateMenu.show();

        // Hide the login menu
        this.hide();        
    }

    addText(x, y, text, style, tab = 0) {
        const textElement = this.scene.add.text(x, y, text, style).setOrigin(0.5);
        this.addElementToTab(tab, textElement);
    }
}
