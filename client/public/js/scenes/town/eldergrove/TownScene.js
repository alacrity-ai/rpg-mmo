import BaseTownScene from '../BaseTownScene.js';
import { fadeTransition, zoomTransition } from '../../utils/SceneTransitions.js';
import SoundFXManager from '../../../audio/SoundFXManager.js';

export default class EldergroveTownScene extends BaseTownScene {
    constructor() {
        super('EldergroveTownScene', 'eldergrove/exterior-1.png', 'forest-1.mp3');
    }

    preload() {
        super.preload();
        // Add additional preload logic here
    }

    create() {
        super.create();

        // Add links to other scenes
        this.interactiveZoneManager.createInteractiveArea(150, 360, 200, 150, 'Market', () => {
            SoundFXManager.playSound('assets/sounds/door_open.wav');
            // this.scene.start('EldergroveMarketScene');
            fadeTransition(this, 'EldergroveMarketScene', 500);
        });

        this.interactiveZoneManager.createInteractiveArea(400, 330, 80, 100, 'Arcanium', () => {
            SoundFXManager.playSound('assets/sounds/door_open.wav');
            // this.scene.start('EldergroveArcaniumScene');
            fadeTransition(this, 'EldergroveArcaniumScene', 500);
        });

        this.interactiveZoneManager.createInteractiveArea(515, 300, 150, 150, 'Blacksmith', () => {
            SoundFXManager.playSound('assets/sounds/door_open.wav');
            // this.scene.start('EldergroveBlacksmithScene');
            fadeTransition(this, 'EldergroveBlacksmithScene', 500);
        });

        this.interactiveZoneManager.createInteractiveArea(780, 360, 150, 150, 'Guild Hall', () => {
            SoundFXManager.playSound('assets/sounds/door_open.wav');
            // this.scene.start('EldergroveGuildhallScene');
            fadeTransition(this, 'EldergroveGuildhallScene', 500);
        });
        // Add pulsating point lights
        this.pointLightManager.addPointLight(510, 355, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.004);
        this.pointLightManager.addPointLight(613, 355, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.006);
        this.pointLightManager.addPointLight(331, 434, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.003); 
    }

    update(time, delta) {
        super.update(time, delta);
    }
}
