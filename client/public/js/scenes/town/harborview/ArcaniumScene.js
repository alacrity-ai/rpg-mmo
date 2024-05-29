import BaseTownScene from '../BaseTownScene.js';

export default class HarborviewArcaniumScene extends BaseTownScene {
    constructor() {
        super('HarborviewArcaniumScene', 'harborview/arcanium.png', null, 'arcanium.wav', 'HarborviewExterior1Scene');
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
        // hot yellow = 0xff4500
        // violet = 0x8a2be2
        this.pointLightManager.addPointLight(36, 210, 0xff4500, 25, 0.09, true, 0.08, 0.14, 0.002);
        // Orb
        this.pointLightManager.addPointLight(495, 284, 0x8a2be2, 105, 0.09, true, 0.11, 0.22, 0.003);
        // Sunset
        this.pointLightManager.addPointLight(498, 219, 0xff4500, 105, 0.01, true, 0.11, 0.22, 0.002);

    }

    update(time, delta) {
        super.update(time, delta);
    }
}
