import { BaseMenu } from './BaseMenu.js';

export default class CharacterCreateMenu extends BaseMenu {
    constructor(scene, width = 700, height = 500) {
        const x = scene.sys.game.config.width / 2;
        const y = scene.sys.game.config.height / 2;
        const backgroundColor = 0x000000;
        const backgroundAlpha = 0.8;
        const borderRadius = 10;

        super(scene, x, y, width, height, backgroundColor, backgroundAlpha, borderRadius);

        this.portraitY = y - height / 4.4;
        this.classes = [
            'rogue',
            'monk',
            'ranger',
            'reaver',
            'paladin',
            'warrior',
            'shaman',
            'priest',
            'druid',
            'arcanist',
            'elementalist',
            'necromancer'
        ];

        this.currentClassIndex = 0;

        this.createCharacterCreateMenu();
    }

    async createCharacterCreateMenu() {
        // Calculate positions
        const nameInputY = this.y - this.height / 2.5; // Position for the name input above the portrait
        const buttonSize = 40;
        const offset = this.width / 4;

        // Add name input
        this.addTextInput(this.x, nameInputY, 300, 40, 'Name');

        // Add left arrow button
        this.addButton(this.x - offset, this.portraitY, buttonSize, buttonSize, '←', () => this.switchClass(-1), null, 0, 0x555555, '#fff', 10, 20);

        // Add right arrow button
        this.addButton(this.x + offset, this.portraitY, buttonSize, buttonSize, '→', () => this.switchClass(1), null, 0, 0x555555, '#fff', 10, 20);

        // Render initial portrait and class name
        await this.renderClass();

        // Add "Create" button at the bottom
        const buttonY = this.y + this.height / 2 - 30;
        const buttonSpacing = 110; // Adjust spacing between buttons
        this.addButton(this.x - buttonSpacing / 2, buttonY, 100, 40, 'Create', () => this.handleCreate());

        // Add "Back" button next to the "Create" button
        this.addButton(this.x + buttonSpacing / 2, buttonY, 100, 40, 'Back', () => this.handleBack());
    }

    async switchClass(direction) {
        this.currentClassIndex = (this.currentClassIndex + direction + this.classes.length) % this.classes.length;
        await this.renderClass();
    }

    async renderClass() {
        const characterClass = this.classes[this.currentClassIndex];
        const atlasImagePath = `assets/images/characters/${characterClass}/portrait/atlas.png`;

        // Clear previous portrait and class name if they exist
        if (this.portrait) {
            this.portrait.sprite.destroy();
            this.portrait.maskShape.destroy();
            this.portrait.border.destroy();
        }
        if (this.classNameText) {
            this.classNameText.destroy();
        }

        // Add character portrait
        this.portrait = await this.addPortrait(this.x, this.portraitY, atlasImagePath, 0);

        // Add class name below the portrait
        this.classNameText = this.addText(this.x, this.y - this.height / 4 + 80, characterClass, { fontSize: '16px', fill: '#fff' });
    }

    handleCreate() {
        const characterName = this.getTextInputValue(0, 0); // Get the name from the input field
        const selectedClass = this.classes[this.currentClassIndex];
        console.log(`New ${selectedClass} with name ${characterName} created`);
        // Implement logic to create a new character
    }

    handleBack() {
        console.log('Back button clicked');
        // Implement logic to go back to the previous menu
    }

    addText(x, y, text, style, tab = 0) {
        const textElement = this.scene.add.text(x, y, text, style).setOrigin(0.5);
        this.addElementToTab(tab, textElement);
        return textElement;
    }
}
