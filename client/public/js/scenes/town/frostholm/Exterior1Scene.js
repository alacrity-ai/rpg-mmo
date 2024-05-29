import BaseTownScene from '../BaseTownScene.js';
import SoundFXManager from '../../../audio/SoundFXManager.js';
import { fadeTransition } from '../../utils/SceneTransitions.js';
import FogEffect from '../../../graphics/FogEffect.js';

export default class FrostholmExterior1Scene extends BaseTownScene {
    constructor() {
        super('FrostholmExterior1Scene', 'frostholm/exterior-1.png', 'frostholm_town_theme.mp3', null, null, {up: 'FrostholmExterior2Scene'});
    }

    preload() {
        super.preload();
        // Add additional preload logic here
    }

    create() {
        super.create();

        // Register Scene on the Map
        this.registry.set('currentSceneKey', this.sceneKey);

        // Add the fog effect
        this.fogEffect = new FogEffect(this, 1, 0.5, 0.8);
    }

    update(time, delta) {
        super.update(time, delta);
    }
}
