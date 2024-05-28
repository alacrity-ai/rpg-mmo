import BaseTownScene from '../BaseTownScene.js';

export default class EldergroveArcaniumScene extends BaseTownScene {
    constructor() {
        super('EldergroveArcaniumScene', 'eldergrove/arcanium.png', null, 'arcanium.wav', 'EldergroveTownScene');
    }

    preload() {
        super.preload();
        // Add additional preload logic here
    }

    create() {
        super.create();
        // Add pulsating point lights
        this.pointLightManager.addPointLight(324, 301, 0x8a2be2, 45, 0.02, true, 0.08, 0.25, 0.003);
        this.pointLightManager.addPointLight(288, 452, 0x00ffff, 20, 0.02, true, 0.02, 0.15, 0.002);
        this.pointLightManager.addPointLight(848, 441, 0x00ffff, 45, 0.02, true, 0.10, 0.25, 0.004);
    }

    update(time, delta) {
        super.update(time, delta);
    }
}
