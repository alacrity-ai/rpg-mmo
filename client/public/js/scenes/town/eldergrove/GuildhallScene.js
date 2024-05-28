import BaseTownScene from '../BaseTownScene.js';

export default class EldergroveGuildhallScene extends BaseTownScene {
    constructor() {
        super('EldergroveGuildhallScene', 'eldergrove/guildhall.png', null, 'guildhall.wav', 'EldergroveTownScene');
    }

    preload() {
        super.preload();
        // Add additional preload logic here

    }

    create() {
        super.create();
        
        // Add point lights
        this.pointLightManager.addPointLight(35, 150, 0xffaa00, 45, 0.02, true, 0.02, 0.18, 0.004);
        this.pointLightManager.addPointLight(172, 298, 0xffaa00, 55, 0.02, true, 0.02, 0.18, 0.003);
        this.pointLightManager.addPointLight(290, 399, 0xffaa00, 25, 0.02, true, 0.02, 0.12, 0.005);
        this.pointLightManager.addPointLight(808, 360, 0xffaa00, 65, 0.02, true, 0.02, 0.18, 0.003);
        this.pointLightManager.addPointLight(963, 142, 0xffaa00, 45, 0.02, true, 0.04, 0.20, 0.002);
    }

    update(time, delta) {
        super.update(time, delta);
    }
}
