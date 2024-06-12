import { BaseMenu } from '../BaseMenu.js';
import ResourceBars from '../../ResourceBars.js';

export default class BattlerDisplayMenu extends BaseMenu {
    constructor(scene, battlerInstances) {
        const x = 60; // Position at the top-left of the screen
        const y = 60;
        const width = 150;
        const height = 200;
        const backgroundColor = 0x333333;
        const backgroundAlpha = 0.9;
        const borderRadius = 10;
        const hasWindow = false;

        super(scene, x, y, width, height, backgroundColor, backgroundAlpha, borderRadius, null, null, false, hasWindow);

        this.battlerInstances = battlerInstances;
        this.resourceBars = [];
        this.portraits = []; // Track portraits
        this.battlerIdToResourceBarsMap = {}; // Mapping of battler IDs to resource bars
        this.renderBattlers();
    }

    async renderBattlers() {
        // Clear previous resource bars and portraits
        this.clearPreviousRenderings();

        // Render player portraits and resource bars
        await this.renderPlayers();

        // Render NPC portraits and resource bars
        await this.renderNPCs();
    }

    async renderPlayers() {
        // Calculate spacing based on the number of battlers
        const portraitSpacing = 110; // Adjust this value as needed for spacing between portraits
        const barSpacing = 10; // Spacing between the portrait and the bars
    
        // Render player portraits and resource bars
        let playerIndex = 0;
        for (const battler of this.battlerInstances) {
            if (battler.characterId != null) {
                const atlasImagePath = `assets/images/characters/${battler.battlerClass}/portrait/atlas.png`;
                const posX = this.x + 20; // Adjust X position if needed
                const posY = this.y + 20 + playerIndex * (portraitSpacing + barSpacing * 2); // Stack portraits vertically with spacing
                const portrait = await this.addPortrait(posX, posY, atlasImagePath, 0);
                this.portraits.push(portrait);
    
                // Calculate positions for the resource bars to be centered to the right of the portrait
                const barX = posX + 50; // Adjust as needed for positioning to the right of the portrait
                const barY = posY - 36; // Center the bars vertically against the portrait
    
                // Display resource bars
                const resourceBars = new ResourceBars(this.scene, barX, barY, battler.baseStats.health, battler.baseStats.mana);
                resourceBars.setHealth(battler.currentStats.health);
                resourceBars.setMana(battler.currentStats.mana);
                this.resourceBars.push(resourceBars);
                
                // Map battler ID to resource bars
                this.battlerIdToResourceBarsMap[battler.id] = resourceBars;
    
                playerIndex++;
            }
        }
    }

    async renderNPCs() {
        // Calculate spacing based on the number of battlers
        const portraitSpacing = 110; // Adjust this value as needed for spacing between portraits
        const barSpacing = 10; // Spacing between the portrait and the bars
    
        // Render NPC portraits and resource bars
        let npcIndex = 0;
        for (const battler of this.battlerInstances) {
            if (battler.npcTemplateId != null) {
                const atlasImagePath = `${battler.spritePath}/portrait/atlas.png`;
                const posX = this.x + 860; // Adjusted
                const posY = this.y + 20 + npcIndex * (portraitSpacing + barSpacing * 2); // Stack portraits vertically with spacing
                const portrait = await this.addPortrait(posX, posY, atlasImagePath, 0);
                this.portraits.push(portrait);
    
                // Calculate positions for the resource bars to be centered to the left of the portrait
                const barX = posX - 66; // Adjusted
                const barY = posY - 36; // Center the bars vertically against the portrait
    
                // Display resource bars
                const resourceBars = new ResourceBars(this.scene, barX, barY, battler.baseStats.health, battler.baseStats.mana);
                resourceBars.setHealth(battler.currentStats.health);
                resourceBars.setMana(battler.currentStats.mana);
                this.resourceBars.push(resourceBars);
                
                // Map battler ID to resource bars
                this.battlerIdToResourceBarsMap[battler.id] = resourceBars;
    
                npcIndex++;
            }
        }
    }

    clearPreviousRenderings() {
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
        
        this.battlerIdToResourceBarsMap = {}; // Clear the mapping
    }

    updateBattlers(battlerInstances) {
        this.battlerInstances = battlerInstances;
        this.renderBattlers();
    }

    // Method to update resource bars by battler ID
    updateResourceBars(battlerId, newHealth, newMana) {
        const resourceBars = this.battlerIdToResourceBarsMap[battlerId];
        if (resourceBars) {
            if (newHealth != null) {
                resourceBars.setHealth(newHealth);
            }
            if (newMana != null) {
                resourceBars.setMana(newMana);
            }
        } else {
            console.warn(`Resource bars not found for battler ID: ${battlerId}`);
        }
    }

    // Method to remove a battler and rerender portraits
    removeBattler(battlerId) {
        // Find the index of the battler to remove
        const battlerIndex = this.battlerInstances.findIndex(battler => battler.id === battlerId);
        if (battlerIndex === -1) {
            console.warn(`Battler with ID: ${battlerId} not found.`);
            return;
        }

        // Remove the battler from the instances array
        const [removedBattler] = this.battlerInstances.splice(battlerIndex, 1);

        // Destroy the resource bars and portrait for the removed battler
        const resourceBars = this.battlerIdToResourceBarsMap[removedBattler.id];
        if (resourceBars) {
            resourceBars.healthBar.destroy();
            resourceBars.manaBar.destroy();
            resourceBars.healthBackground.destroy();
            resourceBars.manaBackground.destroy();
            resourceBars.healthBorder.destroy();
            resourceBars.manaBorder.destroy();
        }
        delete this.battlerIdToResourceBarsMap[removedBattler.id];

        // Remove the corresponding portrait
        const portraitIndex = this.portraits.findIndex(portrait => portrait.battlerId === battlerId);
        if (portraitIndex !== -1) {
            this.removePortrait(this.portraits[portraitIndex]);
            this.portraits.splice(portraitIndex, 1);
        }

        // Rerender the remaining battlers
        this.renderBattlers();
    }
}
