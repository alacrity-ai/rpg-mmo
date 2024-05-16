export default class MusicManager {
    constructor(scene) {
        this.scene = scene;
        this.currentMusic = null;
    }

    playMusic(key, loop = true) {
        // Stop any currently playing music
        if (this.currentMusic) {
            this.currentMusic.stop();
        }

        // Add the music to the scene and play it
        this.currentMusic = this.scene.sound.add(key, {
            loop: loop,
            volume: 1
        });

        this.currentMusic.play();
    }

    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic = null;
        }
    }
}
