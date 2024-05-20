import BaseScene from './BaseScene.js';
import PointLightManager from '../../graphics/PointLight.js';

export default class MarketScene extends BaseScene {
    constructor() {
        super('MarketScene', 'market');
    }

    preload() {
        super.preload();
        // Add additional preload logic here
    }

    create() {
        super.create();
        // Add pulsating point lights
        this.pointLightManager = new PointLightManager(this);
        this.pointLightManager.addPointLight(214, 190, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.004);
        this.pointLightManager.addPointLight(309, 213, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.006);
        this.pointLightManager.addPointLight(402, 209, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.003);
        this.pointLightManager.addPointLight(674, 217, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.004);
        this.pointLightManager.addPointLight(831, 191, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.006);
    }

    update(time, delta) {
        super.update(time, delta);
        // Update point lights with delta time
        this.pointLightManager.update(delta);
    }
}
