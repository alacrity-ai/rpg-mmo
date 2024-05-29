import BaseTownScene from '../BaseTownScene.js';

export default class HarborviewBlacksmithScene extends BaseTownScene {
    constructor() {
        super('HarborviewBlacksmithScene', 'harborview/blacksmith.png', null, 'blacksmith.wav', 'HarborviewExterior1Scene');
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
        // orange = 0xff4500
        // hot yellow = 0xffaa00
        // // Add pulsating point lights
        this.pointLightManager.addPointLight(481, 285, 0xffaa00, 105, 0.12, true, 0.15, 0.3, 0.001);

    }

    update(time, delta) {
        super.update(time, delta);
    }
}
