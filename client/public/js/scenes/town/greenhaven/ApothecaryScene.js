import BaseTownScene from '../BaseTownScene.js';

export default class GreenhavenApothecaryScene extends BaseTownScene {
    constructor() {
        super('GreenhavenApothecaryScene', 'greenhaven/apothecary.png', null, 'arcanium.wav', 'GreenhavenExterior2Scene');
    }

    preload() {
        super.preload();
        // Add additional preload logic here
    }

    create() {
        super.create();
    }

    update(time, delta) {
        super.update(time, delta);
    }
}
