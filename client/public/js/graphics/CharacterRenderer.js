export default class CharacterRenderer {
    constructor(scene, characterNumber, hero, scale = 1, flip = false, frameRate = 10) {
        this.scene = scene;
        this.characterNumber = characterNumber;
        this.hero = hero;
        this.scale = scale;
        this.flip = flip;
        this.frameRate = frameRate;

        this.path = `assets/images/characters/${hero}`;

        this.actions = {
            idle: 20,
            attack: 4,
            cast: 5,
            death: 7,
            hit: 2,
            talk: 44
        };

        this.loadAtlases();
    }

    loadAtlases() {
        for (const action in this.actions) {
            this.scene.load.atlas(
                `${this.characterNumber}_${this.hero}_${action}`,
                `${this.path}/${action}/atlas.png`,
                `${this.path}/${action}/atlas.json`
            );
        }

        // Ensure atlases are loaded before creating the animations
        this.scene.load.once('complete', this.createAnimations, this);
        this.scene.load.start();
    }

    createAnimations() {
        for (const action in this.actions) {
            const textureKey = `${this.characterNumber}_${this.hero}_${action}`;
            const frames = this.scene.textures.get(textureKey).getFrameNames().map(frameName => ({
                key: textureKey,
                frame: frameName
            }));

            this.scene.anims.create({
                key: `${this.characterNumber}_${this.hero}_${action}`,
                frames: frames,
                frameRate: this.frameRate,
                repeat: action === 'death' ? 0 : -1
            });
        }
    }

    playAnimation(action, x, y) {
        const textureKey = `${this.characterNumber}_${this.hero}_${action}`;
        this.characterSprite = this.scene.add.sprite(x, y, textureKey).setOrigin(0.5, 0.5);
        this.characterSprite.play(`${this.characterNumber}_${this.hero}_${action}`);
        this.characterSprite.setScale(this.scale); // Apply scaling
        this.characterSprite.setFlipX(this.flip); // Apply flipping
    }

    changeAnimation(action) {
        if (this.characterSprite) {
            this.characterSprite.play(`${this.characterNumber}_${this.hero}_${action}`);
        }
    }

    stopAnimation() {
        if (this.characterSprite) {
            this.characterSprite.stop();
        }
    }

    hideAnimation() {
        if (this.characterSprite) {
            this.characterSprite.setVisible(false);
        }
    }

    showAnimation() {
        if (this.characterSprite) {
            this.characterSprite.setVisible(true);
            this.characterSprite.play(this.characterSprite.anims.currentAnim.key);
        }
    }

    runOnce(action, callback) {
        if (this.characterSprite) {
            this.characterSprite.once('animationcomplete', () => {
                this.characterSprite.play(`${this.characterNumber}_${this.hero}_idle`);
                if (callback) callback();
            });
            this.characterSprite.play(`${this.characterNumber}_${this.hero}_${action}`);
        }
    }

    changeHero(hero) {
        // Stop current animation
        this.stopAnimation();

        // Unload existing images
        for (const action in this.actions) {
            this.scene.textures.remove(`${this.characterNumber}_${this.hero}_${action}`);
        }

        // Update hero and path
        this.hero = hero;
        this.path = `assets/images/characters/${hero}`;

        // Load new frames and create animations
        this.loadAtlases();

        // Restart the idle animation
        this.scene.load.once('complete', () => {
            this.playAnimation('idle', this.characterSprite.x, this.characterSprite.y);
        });
        this.scene.load.start();
    }
}
