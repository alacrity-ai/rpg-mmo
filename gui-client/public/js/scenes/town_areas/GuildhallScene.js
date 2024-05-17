import BaseScene from './BaseScene.js';
import PointLightSource from '../../graphics/PointLightSource.js';

export default class GuildhallScene extends BaseScene {
    constructor() {
        super('GuildhallScene', 'guildhall');
    }

    preload() {
        super.preload();
        // Add additional preload logic here

    }

    create() {
        super.create();
        // Add pulsating point lights
        this.pointLight1 = new PointLightSource(this, 33, 160, 0xffaa00, 45, 0.02, true, 0.02, 0.18, 0.004);
        this.pointLight2 = new PointLightSource(this, 178, 312, 0xffaa00, 55, 0.02, true, 0.02, 0.18, 0.003);
        this.pointLight3 = new PointLightSource(this, 297, 420, 0xffaa00, 25, 0.02, true, 0.02, 0.12, 0.005);
        this.pointLight4 = new PointLightSource(this, 847, 388, 0xffaa00, 65, 0.02, true, 0.02, 0.18, 0.003);
        this.pointLight5 = new PointLightSource(this, 1013, 156, 0xffaa00, 45, 0.02, true, 0.04, 0.20, 0.002);
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
