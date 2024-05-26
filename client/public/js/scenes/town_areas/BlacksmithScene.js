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
        this.pointLightManager.addPointLight(236, 207, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.004);
        this.pointLightManager.addPointLight(346, 207, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.006);
        this.pointLightManager.addPointLight(482, 272, 0xffaa00, 45, 0.02, true, 0.03, 0.25, 0.008);
        this.pointLightManager.addPointLight(770, 208, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.003);
        this.pointLightManager.addPointLight(866, 254, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.004);
    }

    update(time, delta) {
        super.update(time, delta);

        // Update point lights with delta time
        this.pointLightManager.update(delta);
    }
}
