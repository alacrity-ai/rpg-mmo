import { BaseMenu } from './BaseMenu.js';
import api from '../../api';

export default class CharacterCreateMenu extends BaseMenu {
    constructor(scene, width = 700, height = 500) {
        const x = scene.sys.game.config.width / 2;
        const y = scene.sys.game.config.height / 2;
        const backgroundColor = 0x000000;
        const backgroundAlpha = 0.8;
        const borderRadius = 10;

        super(scene, x, y, width, height, backgroundColor, backgroundAlpha, borderRadius);

        this.portraitY = y - height / 4.8;
        this.classes = [];
        this.currentClassIndex = 0;

        this.fetchClassTemplates();
    }

    async fetchClassTemplates() {
        try {
            const classTemplates = await api.character.classList();
            this.classes = classTemplates.map(classTemplate => classTemplate.name);
            this.classTemplates = classTemplates;

            if (this.classes.length > 0) {
                this.createCharacterCreateMenu();
            } else {
                console.error('No class templates available');
            }
        } catch (error) {
            console.error('Error fetching class templates:', error);
        }
    }

    async createCharacterCreateMenu() {
        // Calculate positions
        const nameInputY = this.y - this.height / 2.5; // Position for the name input above the portrait
        const buttonSize = 40;
        const offset = this.width / 4;

        // Add name input
        this.addTextInput(this.x, nameInputY, 300, 40, 'Name', 0, 16, false, true);

        // Add left arrow button
        this.addButton(this.x - offset, this.portraitY, buttonSize, buttonSize, '←', () => this.switchClass(-1), null, 0, 0x555555, '#fff', 10, 20);

        // Add right arrow button
        this.addButton(this.x + offset, this.portraitY, buttonSize, buttonSize, '→', () => this.switchClass(1), null, 0, 0x555555, '#fff', 10, 20);

        // Render initial portrait and class info
        await this.renderClass();

        // Add "Create" button at the bottom
        const buttonY = this.y + this.height / 2 - 30;
        const buttonSpacing = 110; // Adjust spacing between buttons
        // Light green = 0x00ff00
        // Dark green = 0x00cc00
        // Darker green = 0x009900
        // Even darker green = 0x006600
        this.addButton(this.x - buttonSpacing / 2, buttonY, 100, 40, 'Create', () => this.handleCreate(), null, 0, 0x006600);

        // Add "Back" button next to the "Create" button
        this.addButton(this.x + buttonSpacing / 2, buttonY, 100, 40, 'Back', () => this.handleBack());
    }

    async switchClass(direction) {
        this.currentClassIndex = (this.currentClassIndex + direction + this.classes.length) % this.classes.length;
        await this.renderClass();
    }

    async renderClass() {
        // make the first letter uppercase of characterClass
        const characterClass = this.classes[this.currentClassIndex];
        const classTemplate = this.classTemplates[this.currentClassIndex];
        const atlasImagePath = `assets/images/characters/${characterClass}/portrait/atlas.png`;

        // Clear previous portrait and class info if they exist
        if (this.portrait) {
            this.portrait.sprite.destroy();
            this.portrait.maskShape.destroy();
            this.portrait.border.destroy();
        }
        if (this.classNameText) {
            this.classNameText.destroy();
        }
        if (this.baseStatsText) {
            this.baseStatsText.forEach(text => text.destroy());
        }
        if (this.descriptionText) {
            this.descriptionText.destroy();
        }

        // Add character portrait
        this.portrait = await this.addPortrait(this.x, this.portraitY, atlasImagePath, 0);

        // Add class name below the portrait
        this.classNameText = this.addText(this.x, this.y - this.height / 4 + 90, characterClass.charAt(0).toUpperCase() + characterClass.slice(1), { fontSize: '24px', fill: '#fff' });
        // Add base stats below the class name
        const baseStats = classTemplate.baseStats;
        this.baseStatsText = [
            this.addText(this.x, this.y - this.height / 4 + 120, `Strength: ${baseStats.strength}`, { fontSize: '18px', fill: '#ccc' }),
            this.addText(this.x, this.y - this.height / 4 + 145, `Stamina: ${baseStats.stamina}`, { fontSize: '18px', fill: '#ccc' }),
            this.addText(this.x, this.y - this.height / 4 + 170, `Intelligence: ${baseStats.intelligence}`, { fontSize: '18px', fill: '#ccc' })
        ];

        // Add class description below the base stats
        this.descriptionText = this.addText(this.x, this.y - this.height / 4 + 220, classTemplate.description, { fontSize: '16px', fill: '#ccc', wordWrap: { width: 300 } });
    }

    handleCreate() {
        // Get the name from the input field as all lowercase
        const characterName = this.getTextInputValue(0, 0).toLowerCase();
        const selectedClass = this.classes[this.currentClassIndex];
        console.log(`Creating ${selectedClass} with name ${characterName}`);
        // Call api.character.createCharacter with the character name and selected class
        api.character.createCharacter(characterName, selectedClass)
            .then(data => {
                console.log('Character created successfully:', data);
                // Hide the character create menu
                this.hide();
            })
            .catch(error => {
                console.error('Error creating character:', error);
                // Show error message
                const errorMessage = 'Error creating character';
                const errorMenu = new ErrorMenu(this.scene, errorMessage);
                errorMenu.onClose = () => {
                    this.show();
                };
                this.hideNoOnclose();
                errorMenu.show();
            });
    }

    handleBack() {
        this.hide();
    }

    addText(x, y, text, style, tab = 0) {
        const textElement = this.scene.add.text(x, y, text, style).setOrigin(0.5);
        this.addElementToTab(tab, textElement);
        return textElement;
    }
}
