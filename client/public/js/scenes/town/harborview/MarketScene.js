import BaseTownScene from '../BaseTownScene.js';
import FogEffect from '../../../graphics/FogEffect.js';

export default class HarborviewMarketScene extends BaseTownScene {
    constructor() {
        super('HarborviewMarketScene', 'harborview/market.png', null, 'market.wav', null, {down: 'HarborviewExterior2Scene'});
    }

    preload() {
        super.preload();
        // Add additional preload logic here
    }

    create() {
        super.create();

        // // Add links to other scenes
        // this.interactiveZoneManager.createInteractiveArea(150, 360, 200, 150, 'Market', () => {
        //     SoundFXManager.playSound('assets/sounds/door_open.wav');
        //     this.scene.start('EldergroveMarketScene');
        // });

        // // Add pulsating point lights
        // The current light color is 0xffaa00, but we want more of a sunset orange color which is not that color, a good color would be 0xff4500
        this.pointLightManager.addPointLight(328, 324, 0xff4500, 25, 0.02, true, 0.04, 0.18, 0.003);
        this.pointLightManager.addPointLight(678, 319, 0xff4500, 15, 0.02, true, 0.04, 0.18, 0.001);
        this.pointLightManager.addPointLight(707, 318, 0xff4500, 25, 0.02, true, 0.04, 0.18, 0.002);
        this.pointLightManager.addPointLight(783, 317, 0xff4500, 25, 0.02, true, 0.04, 0.19, 0.001);
        // Sunset
        this.pointLightManager.addPointLight(488, 335, 0xff4500, 105, 0.04, true, 0.15, 0.3, 0.001);

        // Add the fog effect
        this.fogEffect = new FogEffect(this, 1, 0.5, 0.8);
    }

    update(time, delta) {
        super.update(time, delta);
    }
}
