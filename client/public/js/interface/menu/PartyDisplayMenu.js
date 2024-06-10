import { BaseMenu } from './BaseMenu.js';
import api from '../../api';
import ResourceBars from '../ResourceBars';

export default class PartyDisplayMenu extends BaseMenu {
    constructor(scene) {
        const x = 60; // Position at the top-left of the screen
        const y = 60;
        const width = 150;
        const height = 200;
        const backgroundColor = 0x333333;
        const backgroundAlpha = 0.9;
        const borderRadius = 10;
        const hasWindow = false;

        super(scene, x, y, width, height, backgroundColor, backgroundAlpha, borderRadius, null, null, false, hasWindow);

        this.characters = [];
        this.resourceBars = [];
        this.portraits = [];
        this.loadPartyData();
    }

    async loadPartyData() {
        // Fetch the party data
        try {
            const response = await api.party.getParty();
            this.characters = response.characters;
            await this.renderParty();
        } catch (error) {
            console.error('Error loading party data:', error);
        }
    }

    async renderParty() {
        // Clear previous resource bars and portraits
        this.resourceBars.forEach(resourceBar => {
            resourceBar.healthBar.destroy();
            resourceBar.manaBar.destroy();
            resourceBar.healthBackground.destroy();
            resourceBar.manaBackground.destroy();
            resourceBar.healthBorder.destroy();
            resourceBar.manaBorder.destroy();
        });
        this.resourceBars = [];
        
        this.portraits.forEach(portrait => {
            this.removePortrait(portrait);
        });
        this.portraits = [];

        // Calculate spacing based on the number of characters
        const portraitSpacing = 110; // Adjust this value as needed for spacing between portraits
        const barSpacing = 10; // Spacing between the portrait and the bars
        
        for (const [index, character] of this.characters.entries()) {
            const atlasImagePath = `assets/images/characters/${character.characterClass}/portrait/atlas.png`;
            const posX = this.x + 20; // Adjust X position if needed
            const posY = this.y + 20 + index * (portraitSpacing + barSpacing * 2); // Stack portraits vertically with spacing
            const portrait = await this.addPortrait(posX, posY, atlasImagePath, 0);
            this.portraits.push(portrait);

            // Calculate positions for the resource bars to be centered to the right of the portrait
            const barX = posX + 50; // Adjust as needed for positioning to the right of the portrait
            const barY = posY - 36; // Center the bars vertically against the portrait

            // Display resource bars
            const resourceBars = new ResourceBars(this.scene, barX, barY, character.baseStats.health, character.baseStats.mana);
            resourceBars.setHealth(character.currentStats.health);
            resourceBars.setMana(character.currentStats.mana);
            this.resourceBars.push(resourceBars);
        }
    }

    async updateStats() {
        // Periodically fetch the latest party data and update the stat bars
        try {
            const response = await api.party.getParty();
            this.characters = response.characters;
            this.characters.forEach((character, index) => {
                const resourceBars = this.resourceBars[index];
                resourceBars.setHealth(character.currentStats.health);
                resourceBars.setMana(character.currentStats.mana);
            });
        } catch (error) {
            console.error('Error updating party data:', error);
        }
    }
}
