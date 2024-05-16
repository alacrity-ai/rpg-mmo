export default class SoundFXManager {
    constructor(scene) {
        this.scene = scene;
        this.soundCache = new Map();
    }

    playSound(path) {
        // Check if the sound is already cached
        if (this.soundCache.has(path)) {
            const sound = this.soundCache.get(path);
            sound.play();
        } else {
            // Load the sound dynamically and play it
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
