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
        this.pointLightManager.addPointLight(204, 177, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.004);
        this.pointLightManager.addPointLight(294, 201, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.006);
        this.pointLightManager.addPointLight(384, 194, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.003);
        this.pointLightManager.addPointLight(641, 203, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.004);
        this.pointLightManager.addPointLight(790, 178, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.006);
    }

    update(time, delta) {
        super.update(time, delta);
        // Update point lights with delta time
        this.pointLightManager.update(delta);
    }
}
