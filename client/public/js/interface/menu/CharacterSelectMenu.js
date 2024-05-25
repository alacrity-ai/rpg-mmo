import { BaseMenu } from './BaseMenu.js';
import api from '../../api';

export default class CharacterSelectMenu extends BaseMenu {
    constructor(scene, characterData, width = 700, height = 500) { // Adjusted width and height for better layout
        const x = scene.sys.game.config.width / 2;
        const y = scene.sys.game.config.height / 2;
        const backgroundColor = 0x000000;
        const backgroundAlpha = 0.8;
        const borderRadius = 10;

        super(scene, x, y, width, height, backgroundColor, backgroundAlpha, borderRadius);

        // this.characterData = characterData;
        this.characterData = [
            {"id":1,"userId":1,"name":"mike","characterClass":"paladin","baseStats":{"stamina":7,"strength":6,"intelligence":4},"currentStats":{"stamina":7,"strength":6,"intelligence":4},"currentAreaId":null,"flags":""},
            {"id":2,"userId":1,"name":"john","characterClass":"priest","baseStats":{"stamina":5,"strength":4,"intelligence":8},"currentStats":{"stamina":5,"strength":4,"intelligence":8},"currentAreaId":null,"flags":""},
            {"id":3,"userId":1,"name":"sarah","characterClass":"knight","baseStats":{"stamina":8,"strength":7,"intelligence":3},"currentStats":{"stamina":8,"strength":7,"intelligence":3},"currentAreaId":null,"flags":""},
            {"id":4,"userId":1,"name":"lucas","characterClass":"mage","baseStats":{"stamina":4,"strength":3,"intelligence":9},"currentStats":{"stamina":4,"strength":3,"intelligence":9},"currentAreaId":null,"flags":""},
            {"id":5,"userId":1,"name":"anna","characterClass":"rogue","baseStats":{"stamina":6,"strength":5,"intelligence":6},"currentStats":{"stamina":6,"strength":5,"intelligence":6},"currentAreaId":null,"flags":""},
            {"id":6,"userId":1,"name":"mark","characterClass":"paladin","baseStats":{"stamina":7,"strength":6,"intelligence":4},"currentStats":{"stamina":7,"strength":6,"intelligence":4},"currentAreaId":null,"flags":""},
            {"id":7,"userId":1,"name":"julia","characterClass":"priest","baseStats":{"stamina":5,"strength":4,"intelligence":8},"currentStats":{"stamina":5,"strength":4,"intelligence":8},"currentAreaId":null,"flags":""},
            {"id":8,"userId":1,"name":"dave","characterClass":"knight","baseStats":{"stamina":8,"strength":7,"intelligence":3},"currentStats":{"stamina":8,"strength":7,"intelligence":3},"currentAreaId":null,"flags":""},
            {"id":9,"userId":1,"name":"emma","characterClass":"mage","baseStats":{"stamina":4,"strength":3,"intelligence":9},"currentStats":{"stamina":4,"strength":3,"intelligence":9},"currentAreaId":null,"flags":""},
            {"id":10,"userId":1,"name":"chris","characterClass":"rogue","baseStats":{"stamina":6,"strength":5,"intelligence":6},"currentStats":{"stamina":6,"strength":5,"intelligence":6},"currentAreaId":null,"flags":""},
            {"id":11,"userId":1,"name":"bella","characterClass":"paladin","baseStats":{"stamina":7,"strength":6,"intelligence":4},"currentStats":{"stamina":7,"strength":6,"intelligence":4},"currentAreaId":null,"flags":""}
        ]

        this.createCharacterSelectMenu();      
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
        // For example: this.scene.start('CharacterCreationMenu');
    }

    addText(x, y, text, style, tab = 0) {
        const textElement = this.scene.add.text(x, y, text, style).setOrigin(0.5);
        this.addElementToTab(tab, textElement);
    }
}
