# MusicManager

How to use the MusicManager class

### Preload the Music Files
In your scene file, preload the music files in the preload method:

```
class YourScene extends Phaser.Scene {
    preload() {
        this.load.audio('background-music', 'assets/music/your-music-file.mp3');
        this.load.audio('another-music', 'assets/music/another-music-file.mp3');
    }
}

```

### Initialize and Use the MusicManager
Initialize the MusicManager in the create method of your scene and use it to play or stop music:

```
import MusicManager from '../audio/MusicManager.js';

class YourScene extends Phaser.Scene {
    preload() {
        // Load your music files
        this.load.audio('background-music', 'assets/music/your-music-file.mp3');
        this.load.audio('another-music', 'assets/music/another-music-file.mp3');
    }

    create() {
        // Initialize the music manager
        this.musicManager = new MusicManager(this);

        // Play background music
        this.musicManager.playMusic('background-music');

        // Example: Play another music file after some event
        this.time.delayedCall(5000, () => {
            this.musicManager.playMusic('another-music');
        });

        // Example: Stop music after some event
        this.time.delayedCall(10000, () => {
            this.musicManager.stopMusic();
        });
    }
}
```