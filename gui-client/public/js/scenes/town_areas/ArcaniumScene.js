import BaseScene from './BaseScene.js';
import PointLightSource from '../../graphics/PointLightSource.js';

export default class ArcaniumScene extends BaseScene {
    constructor() {
        super('ArcaniumScene', 'arcanium');
    }

    preload() {
        super.preload();
        // Add additional preload logic here

    }

    create() {
        super.create();
        // Add pulsating point lights
        // yellow = 0xffaa00
        // violet = 0x8a2be2
        // cyan = 0x00ffff
        this.pointLight1 = new PointLightSource(this, 342, 317, 0x8a2be2, 35, 0.02, true, 0.08, 0.25, 0.003);
        this.pointLight2 = new PointLightSource(this, 305, 482, 0x00ffff, 20, 0.02, true, 0.02, 0.15, 0.002);
        this.pointLight3 = new PointLightSource(this, 890, 469, 0x00ffff, 45, 0.02, true, 0.10, 0.25, 0.004);
    }

    update(time, delta) {
        super.update(time, delta);
        // Update point lights with delta time
        this.pointLight1.update(delta);
        this.pointLight2.update(delta);
        this.pointLight3.update(delta);

    }
}
