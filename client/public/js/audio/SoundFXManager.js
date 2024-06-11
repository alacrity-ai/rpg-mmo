class SoundFXManager {
    constructor() {
        if (!SoundFXManager.instance) {
            this.soundCache = new Map();
            SoundFXManager.instance = this;
        }
        return SoundFXManager.instance;
    }

    initialize(scene) {
        this.scene = scene;
    }

    preloadSounds(soundPaths) {
        soundPaths.forEach(path => {
            this.scene.load.audio(path, path);
        });
    }

    onPreloadComplete() {
        this.scene.load.once('complete', () => {
            this.scene.sound.sounds.forEach(sound => {
                this.soundCache.set(sound.key, sound);
            });
        });
    }

    playSound(path) {
        // Check if the sound is already cached
        if (this.soundCache.has(path)) {
            const sound = this.soundCache.get(path);
            sound.play();
        } else {
            // Load the sound dynamically and play it once loaded
            this.scene.load.audio(path, path);
            this.scene.load.once('complete', () => {
                const sound = this.scene.sound.add(path);
                this.soundCache.set(path, sound);
                sound.play();
            });
            this.scene.load.start();
        }
    }
}

const instance = new SoundFXManager();
export default instance;
