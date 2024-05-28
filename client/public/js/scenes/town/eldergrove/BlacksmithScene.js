import BaseTownScene from '../BaseTownScene.js';

export default class EldergroveBlacksmithScene extends BaseTownScene {
    constructor() {
        super('EldergroveBlacksmithScene', 'eldergrove/blacksmith.png', null, 'blacksmith.wav', 'EldergroveTownScene');
    }

    preload() {
        super.preload();
        // Add additional preload logic here
    }

    create() {
        super.create();

        // Add pulsating point lights
        this.pointLightManager.addPointLight(236, 207, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.004);
        this.pointLightManager.addPointLight(346, 207, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.006);
        this.pointLightManager.addPointLight(482, 272, 0xffaa00, 45, 0.02, true, 0.03, 0.25, 0.008);
        this.pointLightManager.addPointLight(770, 208, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.003);
        this.pointLightManager.addPointLight(866, 254, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.004);
    }

    update(time, delta) {
        super.update(time, delta);
    }
}
