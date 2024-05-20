import BaseScene from './BaseScene.js';
import PointLightManager from '../../graphics/PointLight.js';

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
        this.pointLightManager = new PointLightManager(this);
        this.pointLightManager.addPointLight(342, 317, 0x8a2be2, 45, 0.02, true, 0.08, 0.25, 0.003);
        this.pointLightManager.addPointLight(305, 482, 0x00ffff, 20, 0.02, true, 0.02, 0.15, 0.002);
        this.pointLightManager.addPointLight(890, 469, 0x00ffff, 45, 0.02, true, 0.10, 0.25, 0.004);
    }

    update(time, delta) {
        super.update(time, delta);
        // Update point lights with delta time
        this.pointLightManager.update(delta);
    }
}
