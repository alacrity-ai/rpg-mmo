import BaseTownScene from '../BaseTownScene.js';


export default class HarborviewGemcutterScene extends BaseTownScene {
    constructor() {
        super('HarborviewGemcutterScene', 'harborview/gemcutter.png', null, 'arcanium.wav', 'HarborviewExterior3Scene');
    }

    preload() {
        super.preload();
        // Add additional preload logic here
    }

    create() {
        super.create();

        // Add pointlights
        this.pointLightManager.addPointLight(50, 246, 0xffdab9, 45, 0.01, true, 0.09, 0.14, 0.002);
        this.pointLightManager.addPointLight(950, 246, 0xffdab9, 45, 0.01, true, 0.09, 0.14, 0.003);
    }

    update(time, delta) {
        super.update(time, delta);
    }
}
