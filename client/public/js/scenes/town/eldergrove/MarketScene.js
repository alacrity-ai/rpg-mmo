import BaseTownScene from '../BaseTownScene.js';

export default class EldergroveMarketScene extends BaseTownScene {
    constructor() {
        super('EldergroveMarketScene', 'eldergrove/market.png', null, 'market.wav', 'EldergroveTownScene');
    }

    preload() {
        super.preload();
        // Add additional preload logic here
    }

    create() {
        super.create();
        // Add pulsating point lights
        this.pointLightManager.addPointLight(204, 177, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.004);
        this.pointLightManager.addPointLight(294, 201, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.006);
        this.pointLightManager.addPointLight(384, 194, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.003);
        this.pointLightManager.addPointLight(641, 203, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.004);
        this.pointLightManager.addPointLight(790, 178, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.006);
    }

    update(time, delta) {
        super.update(time, delta);
    }
}
