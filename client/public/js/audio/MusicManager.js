class MusicManager {
    constructor() {
        if (!MusicManager.instance) {
            this.currentMusic = null;
            this.currentAmbient = null;
            this.currentMusicKey = null;
            this.currentAmbientKey = null;
            MusicManager.instance = this;
        }
        return MusicManager.instance;
    }

    initialize(scene) {
        this.scene = scene;
    }

    playMusic(key, loop = true) {
        // Check if the current music is already playing
        if (this.currentMusicKey === key) {
            return;
        }

        // Stop any currently playing music
        if (this.currentMusic) {
            this.currentMusic.stop();
        }

        this.currentMusic = this.scene.sound.add(key, {
            loop: loop,
            volume: 1
        });

        this.currentMusicKey = key;
        this.currentMusic.play();
        this.currentMusic.setVolume(0);
    }

    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic = null;
            this.currentMusicKey = null;
        }
    }

    playAmbient(key, loop = true) {
        // Check if the current ambient sound is already playing
        if (this.currentAmbientKey === key) {
            return;
        }

        // Stop any currently playing ambient sound
        if (this.currentAmbient) {
            this.currentAmbient.stop();
        }

        this.currentAmbient = this.scene.sound.add(key, {
            loop: loop,
            volume: 1
        });

        this.currentAmbientKey = key;
        this.currentAmbient.play();
    }

    stopAmbient() {
        if (this.currentAmbient) {
            this.currentAmbient.stop();
            this.currentAmbient = null;
            this.currentAmbientKey = null;
        }
    }
}

const instance = new MusicManager();
export default instance;
