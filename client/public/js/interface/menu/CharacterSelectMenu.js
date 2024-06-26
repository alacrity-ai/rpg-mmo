import { BaseMenu } from './BaseMenu.js';
import CharacterCreateMenu from './CharacterCreateMenu.js';
import { capitalizeFirstLetter } from '../../utils/stringUtils.js';
import { fadeTransition } from '../../scenes/utils/SceneTransitions.js';
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
            this.characterData = characters;
            this.createCharacterSelectMenu(); // Create the menu after fetching the data
        } catch (error) {
            console.error('Error fetching character list:', error);
            // Show error message
            const errorMessage = 'Failed to load character list';
            const errorMenu = new ErrorMenu(this.scene, errorMessage);
            errorMenu.onClose = () => {
                fadeTransition(this.scene, 'LoginScene');
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
            
            // Add character name and class
            this.addText(posX, posY + 64, capitalizeFirstLetter(character.name), { fontSize: '16px', fill: '#fff' });
            this.addText(posX, posY + 84, capitalizeFirstLetter(character.characterClass), { fontSize: '14px', fill: '#ccc' });

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
                this.scene.registry.set('characterId', data.id);
                this.scene.scene.get('LoginScene').cleanup();
                fadeTransition(this.scene, this.scene.registry.get('firstSceneKey'));
                this.hide();
    
                // Call createParty after logging in the character
                return api.party.createParty();
            })
            .then(partyData => {
                console.log('Party created successfully:', partyData);
                // Optionally, store partyId in registry or handle as needed
                this.scene.registry.set('partyId', partyData.partyId);
            })
            .catch(error => {
                console.error('Error during character login or party creation:', error);
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
        characterCreateMenu.onClose = () => {
            this.show();
            this.reload();
        };
        characterCreateMenu.show();

        // Hide the login menu
        this.hide();        
    }

    addText(x, y, text, style, tab = 0) {
        const textElement = this.scene.add.text(x, y, text, style).setOrigin(0.5);
        this.addElementToTab(tab, textElement);
    }

    reload() {
        this.destroy();
        this.addWindow(this.x, this.y, this.width, this.height, this.backgroundColor, this.backgroundAlpha, this.borderRadius);
        this.loadCharacterData();
    }
}
