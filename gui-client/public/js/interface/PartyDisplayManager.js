import CharacterPortrait from '../interface/CharacterPortrait';
import ResourceBars from '../interface/ResourceBars';

export default class PartyDisplayManager {
    constructor(scene, party) {
        this.scene = scene;
        this.party = party; // An array of character data
        this.portraits = [];
        this.resourceBars = [];
        this.scene.load.once('complete', this.displayParty, this);
        this.loadPartyFrames();
    }

    loadPartyFrames() {
        this.party.forEach((character, index) => {
            for (let i = 0; i < character.frameCount; i++) {
                const frameNumber = i.toString().padStart(3, '0');
                this.scene.load.image(`${index}_portrait_frame_${character.prefix}_${frameNumber}`, `assets/images/characters/${character.prefix}/portrait/frame_${frameNumber}.png`);
            }
        });
        this.scene.load.start();
    }

    displayParty() {
        const portraitHeight = 100;
        const barHeight = 60;
        const startX = this.scene.sys.game.config.width - 36; // Position of the right-most element
        let startY = 35; // Top position for the first portrait and bars

        this.party.forEach((character, index) => {
            const frames = [];
            for (let i = 0; i < character.frameCount; i++) {
                const frameNumber = i.toString().padStart(3, '0');
                frames.push({ key: `${index}_portrait_frame_${character.prefix}_${frameNumber}` });
            }

            // Display character portrait
            const portrait = new CharacterPortrait(
                this.scene,
                character.frameCount,
                startX,
                startY,
                10,
                frames,
                index
            );
            this.portraits.push(portrait);

            // Calculate bar positions
            const barX = startX + 10;
            const barY = startY + (portraitHeight - barHeight) / 2;

            // Display resource bars
            const resourceBars = new ResourceBars(this.scene, barX, barY, character.maxHealth, character.maxMana);
            this.resourceBars.push(resourceBars);

            // Update Y position for the next character
            startY += portraitHeight + 20; // Height of portrait + additional spacing
        });
    }

    updateHealth(index, value) {
        if (index >= 0 && index < this.resourceBars.length) {
            this.resourceBars[index].adjustHealth(value);
        }
    }

    updateMana(index, value) {
        if (index >= 0 && index < this.resourceBars.length) {
            this.resourceBars[index].adjustMana(value);
        }
    }
}

