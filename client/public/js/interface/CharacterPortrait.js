export default class CharacterPortrait {
    constructor(scene, frameCount, x, y, frameRate = 10, frames = [], partyIndex = 0) {
        this.scene = scene;
        this.frameCount = frameCount;
        this.x = x;
        this.y = y;
        this.frameRate = frameRate;
        this.frames = frames;
        this.partyIndex = partyIndex;

        this.createAnimation();
        this.displayAnimation();
    }

    createAnimation() {
        this.scene.anims.create({
            key: `characterportrait_${this.partyIndex}_anim`,
            frames: this.frames,
            frameRate: this.frameRate,
            repeat: -1
        });
    }

    displayAnimation() {
        const width = 75;
        const height = 100;
        const radius = 10;

        // Create a rounded rectangle background with a white border
        const background = this.scene.add.graphics();
        background.fillStyle(0x808080, 0.8);
        background.fillRoundedRect(this.x - width, this.y, width, height, radius);
        background.lineStyle(2, 0xffffff, 1);
        background.strokeRoundedRect(this.x - width, this.y, width, height, radius);
        
        // Create the portrait sprite
        this.portrait = this.scene.add.sprite(this.x + 4, this.y, this.frames[0].key).setOrigin(1, 0);
        this.portrait.play(`characterportrait_${this.partyIndex}_anim`);
        this.portrait.setDisplaySize(width, height); 

        // Ensure the background is behind the portrait
        this.portrait.depth = 1;
        background.depth = 0;
    }
}
