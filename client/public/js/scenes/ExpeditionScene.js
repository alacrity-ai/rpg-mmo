import Phaser from 'phaser';

export default class ExpeditionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ExpeditionScene' });
    }

    preload() {
        this.load.image('background', 'assets/images/zones/z1-1-forest.png');
        this.load.audio('background-music', 'assets/music/forest-1.mp3');
    }

    create() {
        // Add the background image and ensure it fits the canvas
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

        // Initialize the music manager
        this.musicManager = new MusicManager(this);

        // Initialize the SFX Manager
        this.soundFXManager = new SoundFXManager(this);

        // Play background music
        this.musicManager.playMusic('background-music');

        // Add your expedition logic here
        this.add.text(100, 100, 'Expedition', { fontSize: '32px', fill: '#fff' });
    }
}
