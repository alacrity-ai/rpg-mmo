import { BaseMenu } from '../BaseMenu.js';
import api from '../../../api';
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
        this.renderBattlers();
    }

    renderBattlers() {
        // Clear previous resource bars
        this.resourceBars.forEach(resourceBar => {
            resourceBar.healthBar.destroy();
            resourceBar.manaBar.destroy();
            resourceBar.healthBackground.destroy();
            resourceBar.manaBackground.destroy();
            resourceBar.healthBorder.destroy();
            resourceBar.manaBorder.destroy();
        });
        this.resourceBars = [];
        
        // Calculate spacing based on the number of battlers
        const portraitSpacing = 110; // Adjust this value as needed for spacing between portraits
        const barSpacing = 10; // Spacing between the portrait and the bars
    
        // Render player portraits and resource bars
        let playerIndex = 0;
        this.battlerInstances.forEach((battler) => {
            if (battler.characterId != null) {
                const atlasImagePath = `assets/images/characters/${battler.battlerClass}/portrait/atlas.png`;
                const posX = this.x + 20; // Adjust X position if needed
                const posY = this.y + 20 + playerIndex * (portraitSpacing + barSpacing * 2); // Stack portraits vertically with spacing
                this.addPortrait(posX, posY, atlasImagePath, 0);
    
                // Calculate positions for the resource bars to be centered to the right of the portrait
                const barX = posX + 50; // Adjust as needed for positioning to the right of the portrait
                const barY = posY - 36; // Center the bars vertically against the portrait
    
                // Display resource bars
                const resourceBars = new ResourceBars(this.scene, barX, barY, battler.baseStats.health, battler.baseStats.mana);
                resourceBars.setHealth(battler.currentStats.health);
                resourceBars.setMana(battler.currentStats.mana);
                this.resourceBars.push(resourceBars);
    
                playerIndex++;
            }
        });
    
        // Render NPC portraits and resource bars
        let npcIndex = 0;
        this.battlerInstances.forEach((battler) => {
            if (battler.npcTemplateId != null) {
                const atlasImagePath = `${battler.spritePath}/portrait/atlas.png`;
                const posX = this.x + 860; // Adjusted
                const posY = this.y + 20 + npcIndex * (portraitSpacing + barSpacing * 2); // Stack portraits vertically with spacing
                this.addPortrait(posX, posY, atlasImagePath, 0);
    
                // Calculate positions for the resource bars to be centered to the left of the portrait
                const barX = posX - 66; // Adjusted
                const barY = posY - 36; // Center the bars vertically against the portrait
    
                // Display resource bars
                const resourceBars = new ResourceBars(this.scene, barX, barY, battler.baseStats.health, battler.baseStats.mana);
                resourceBars.setHealth(battler.currentStats.health);
                resourceBars.setMana(battler.currentStats.mana);
                this.resourceBars.push(resourceBars);
    
                npcIndex++;
            }
        });
    }
    
}
