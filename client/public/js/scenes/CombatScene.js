import Phaser from 'phaser';

export default class CombatScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CombatScene' });
    }

    preload() {
        this.load.image('background', 'assets/images/zones/z1-1-forest.png');
        this.load.audio('background-music', 'assets/music/forest-1.mp3');
    }

    create() {
        this.add.image(525, 300, 'background');

        // Initialize the music manager
        this.musicManager = new MusicManager(this);

        // Initialize the SFX Manager
        this.soundFXManager = new SoundFXManager(this);

        // Play background music
        this.musicManager.playMusic('background-music');

        // Add your combat logic here
        this.add.text(100, 100, 'Combat', { fontSize: '32px', fill: '#fff' });
    }
}
