import BaseTownScene from '../BaseTownScene.js';

export default class HarborviewGuildhallScene extends BaseTownScene {
    constructor() {
        super('HarborviewGuildhallScene', 'harborview/guildhall.png', null, 'guildhall.wav', 'HarborviewExterior2Scene');
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

        // Add pulsating point lights
        this.pointLightManager.addPointLight(57, 266, 0xffaa00, 25, 0.02, true, 0.04, 0.18, 0.003);
        this.pointLightManager.addPointLight(302, 273, 0xffaa00, 25, 0.02, true, 0.04, 0.18, 0.004);
        this.pointLightManager.addPointLight(329, 279, 0xffaa00, 25, 0.02, true, 0.04, 0.18, 0.002);
        this.pointLightManager.addPointLight(761, 267, 0xffaa00, 25, 0.02, true, 0.04, 0.19, 0.001);
        this.pointLightManager.addPointLight(868, 239, 0xffaa00, 25, 0.02, true, 0.04, 0.18, 0.003);
        this.pointLightManager.addPointLight(985, 200, 0xffaa00, 25, 0.02, true, 0.04, 0.18, 0.004);
        this.pointLightManager.addPointLight(498, 103, 0xff4500, 105, 0.21, true, 0.22, 0.32, 0.002);
    }

    update(time, delta) {
        super.update(time, delta);
    }
}
