import BaseScene from './BaseScene.js';
import PointLightManager from '../../graphics/PointLight.js';

export default class BlacksmithScene extends BaseScene {
    constructor() {
        super('BlacksmithScene', 'blacksmith');
    }

    preload() {
        super.preload();
        // Add additional preload logic here
    }

    create() {
        super.create();

        // Initialize PointLightManager
        this.pointLightManager = new PointLightManager(this);

        // Add pulsating point lights
        this.pointLightManager.addPointLight(250, 221, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.004);
        this.pointLightManager.addPointLight(365, 219, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.006);
        this.pointLightManager.addPointLight(810, 220, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.003);
        this.pointLightManager.addPointLight(910, 271, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.004);
        this.pointLightManager.addPointLight(506, 292, 0xffaa00, 35, 0.02, true, 0.04, 0.25, 0.008);
    }

    update(time, delta) {
        super.update(time, delta);

        // Update point lights with delta time
        this.pointLightManager.update(delta);
    }
}
