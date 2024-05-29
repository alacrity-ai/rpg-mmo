import BaseTownScene from '../BaseTownScene.js';

export default class HarborviewResidence1Scene extends BaseTownScene {
    constructor() {
        super('HarborviewResidence1Scene', 'harborview/residence-1.png', null, null, 'HarborviewExterior1Scene');
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
        this.pointLightManager.addPointLight(552, 204, 0xff4500, 105, 0.01, true, 0.11, 0.22, 0.002);

    }

    update(time, delta) {
        super.update(time, delta);
    }
}
