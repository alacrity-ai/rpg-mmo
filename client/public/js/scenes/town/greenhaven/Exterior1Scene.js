import BaseTownScene from '../BaseTownScene.js';
import SoundFXManager from '../../../audio/SoundFXManager.js';
import { fadeTransition } from '../../utils/SceneTransitions.js';
import FogEffect from '../../../graphics/FogEffect.js';

export default class GreenhavenExterior1Scene extends BaseTownScene {
    constructor() {
        super('GreenhavenExterior1Scene', 'greenhaven/exterior-1.png', 'greenhaven_town_theme.mp3', null, null, {up: 'GreenhavenExterior2Scene'});
    }

    preload() {
        super.preload();
        // Add additional preload logic here
    }

    create() {
        super.create();

        // Register Scene on the Map
        this.registry.set('currentSceneKey', this.sceneKey);
    }

    update(time, delta) {
        super.update(time, delta);
    }
}
