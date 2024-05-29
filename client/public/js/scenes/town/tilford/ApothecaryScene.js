import BaseTownScene from '../BaseTownScene.js';

export default class TilfordApothecaryScene extends BaseTownScene {
    constructor() {
        super('TilfordApothecaryScene', 'tilford/apothecary.png', null, 'arcanium.wav', 'TilfordExterior2Scene');
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
