import BaseTownScene from '../BaseTownScene.js';
import SoundFXManager from '../../../audio/SoundFXManager.js';

export default class TilfordExterior1Scene extends BaseTownScene {
    constructor() {
        super('TilfordExterior1Scene', 'tilford/exterior-1.png', 'forest-1.mp3', null, null, {up: 'TilfordExterior2Scene'});
    }

    preload() {
        super.preload();
        // Add additional preload logic here
    }

    create() {
        super.create();

        // // Add links to other scenes
        // this.interactiveZoneManager.createInteractiveArea(150, 360, 200, 150, 'Market', () => {
        //     SoundFXManager.playSound('assets/sounds/door_open.wav');
        //     this.scene.start('EldergroveMarketScene');
        // });

        // // Add pulsating point lights
        // this.pointLightManager.addPointLight(510, 355, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.004);

    }

    update(time, delta) {
        super.update(time, delta);
    }
}
