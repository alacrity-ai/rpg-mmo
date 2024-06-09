export default class CharacterRenderer {
    constructor(scene, characterNumber, sex, bodyNumber, hairNumber = 1, armorNumber = 1, frameRate = 10) {
        this.scene = scene;
        this.characterNumber = characterNumber;
        this.sex = sex;
        this.bodyNumber = bodyNumber;
        this.hairNumber = hairNumber;
        this.armorNumber = armorNumber;
        this.frameRate = frameRate;

        this.path = `assets/images/paperdoll/body/${sex}_${bodyNumber}`;
        this.hairPath = `assets/images/paperdoll/hair/${sex}_${hairNumber}`;
        this.armorPath = `assets/images/paperdoll/armor/${sex}_${armorNumber}`;

        this.actions = {
            idle: 20,
            attack: 4,
            cast: 5,
            die: 7,
            hit: 2,
            talk: 44
        };

        this.loadFrames();
    }

    loadFrames() {
        Object.keys(this.actions).forEach(action => {
            const frameCount = this.actions[action];
            for (let i = 0; i < frameCount; i++) {
                const frameNumber = i.toString().padStart(3, '0');
                this.scene.load.image(`${this.characterNumber}_body_${action}_${frameNumber}`, `${this.path}/${action}/frame_${frameNumber}.png`);
                this.scene.load.image(`${this.characterNumber}_hair_${action}_${frameNumber}`, `${this.hairPath}/${action}/frame_${frameNumber}.png`);
                this.scene.load.image(`${this.characterNumber}_armor_${action}_${frameNumber}`, `${this.armorPath}/${action}/frame_${frameNumber}.png`);
            }
        });

        // Ensure frames are loaded before creating the animations
        this.scene.load.once('complete', this.onFramesLoaded, this);
        this.scene.load.start();
    }

    onFramesLoaded() {
        this.createAnimations();
    }

    createAnimations() {
        Object.keys(this.actions).forEach(action => {
            const frames = [];
            const frameCount = this.actions[action];
            for (let i = 0; i < frameCount; i++) {
                const frameNumber = i.toString().padStart(3, '0');
                const bodyKey = `${this.characterNumber}_body_${action}_${frameNumber}`;
                const hairKey = `${this.characterNumber}_hair_${action}_${frameNumber}`;
                const armorKey = `${this.characterNumber}_armor_${action}_${frameNumber}`;
                const combinedKey = `${this.characterNumber}_combined_${action}_${frameNumber}`;
                
                // Create combined frame
                this.createCombinedFrame(bodyKey, armorKey, hairKey, combinedKey);

                frames.push({ key: combinedKey });
            }

            this.scene.anims.create({
                key: `${this.characterNumber}_character_${action}_anim`,
                frames: frames,
                frameRate: this.frameRate,
                repeat: action === 'idle' ? -1 : 0 // Loop idle animation, run others once
            });
        });
    }

    createCombinedFrame(bodyKey, armorKey, hairKey, combinedKey) {
        const bodyTexture = this.scene.textures.get(bodyKey).getSourceImage();
        const armorTexture = this.scene.textures.get(armorKey).getSourceImage();
        const hairTexture = this.scene.textures.get(hairKey).getSourceImage();

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = bodyTexture.width;
        canvas.height = bodyTexture.height;

        context.drawImage(bodyTexture, 0, 0);
        context.drawImage(armorTexture, 0, 0);
        context.drawImage(hairTexture, 0, 0);

        this.scene.textures.addImage(combinedKey, canvas);
    }

    playAnimation(x, y, action = 'idle') {
        this.characterSprite = this.scene.add.sprite(x, y, `${this.characterNumber}_combined_${action}_000`).setOrigin(0.5, 0.5);
        this.characterSprite.play(`${this.characterNumber}_character_${action}_anim`);
    }

    changeAnimation(action) {
        if (this.characterSprite && this.scene.anims.exists(`${this.characterNumber}_character_${action}_anim`)) {
            this.characterSprite.play(`${this.characterNumber}_character_${action}_anim`);
        } else {
            console.warn(`Animation for action "${action}" does not exist.`);
        }
    }

    stopAnimation() {
        if (this.characterSprite) {
            this.characterSprite.anims.stop();
        }
    }

    hideAnimation() {
        if (this.characterSprite) {
            this.characterSprite.visible = false;
        }
    }

    showAnimation() {
        if (this.characterSprite) {
            this.characterSprite.visible = true;
            if (this.characterSprite.anims.currentAnim) {
                this.characterSprite.play(this.characterSprite.anims.currentAnim.key);
            }
        }
    }

    runOnce(action) {
        if (this.characterSprite && this.scene.anims.exists(`${this.characterNumber}_character_${action}_anim`)) {
            this.characterSprite.play(`${this.characterNumber}_character_${action}_anim`);

            this.characterSprite.once('animationcomplete', () => {
                this.characterSprite.play(`${this.characterNumber}_character_idle_anim`);
            });
        } else {
            console.warn(`Animation for action "${action}" does not exist.`);
        }
    }
}
