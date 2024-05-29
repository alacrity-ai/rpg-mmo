import BaseTownScene from '../BaseTownScene.js';

export default class FrostholmLeatherworkerScene extends BaseTownScene {
    constructor() {
        super('FrostholmLeatherworkerScene', 'frostholm/leatherworker.png', null, 'arcanium.wav', 'FrostholmExterior3Scene');
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
