import BaseScene from './BaseScene.js';
import PointLightSource from '../../graphics/PointLightSource.js';

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
        // Add pulsating point lights
        this.pointLight1 = new PointLightSource(this, 250, 221, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.004);
        this.pointLight2 = new PointLightSource(this, 365, 219, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.006);
        this.pointLight3 = new PointLightSource(this, 810, 220, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.003);
        this.pointLight4 = new PointLightSource(this, 910, 271, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.004);
        this.pointLight5 = new PointLightSource(this, 506, 292, 0xffaa00, 35, 0.02, true, 0.04, 0.25, 0.008);
    }

    update(time, delta) {
        super.update(time, delta);
        // Update point lights with delta time
        this.pointLight1.update(delta);
        this.pointLight2.update(delta);
        this.pointLight3.update(delta);
        this.pointLight4.update(delta);
        this.pointLight5.update(delta);

    }
}
