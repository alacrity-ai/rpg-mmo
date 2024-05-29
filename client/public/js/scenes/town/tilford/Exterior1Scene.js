import BaseTownScene from '../BaseTownScene.js';
import SoundFXManager from '../../../audio/SoundFXManager.js';
import { fadeTransition } from '../../utils/SceneTransitions.js';
import FogEffect from '../../../graphics/FogEffect.js';

export default class TilfordExterior1Scene extends BaseTownScene {
    constructor() {
        super('TilfordExterior1Scene', 'tilford/exterior-1.png', 'tilford_town_theme.mp3', null, null, {up: 'TilfordExterior2Scene'});
    }

    preload() {
        super.preload();
        // Add additional preload logic here
    }

    create() {
        super.create();

        // Register Scene on the Map
        this.registry.set('currentSceneKey', this.sceneKey);

        // Add links to other scenes
        this.interactiveZoneManager.createInteractiveArea(170, 350, 200, 150, 'Market', () => {
            SoundFXManager.playSound('assets/sounds/door_open.wav');
            fadeTransition(this, 'TilfordMarketScene', 500);
        });

        // Add the fog effect
        this.fogEffect = new FogEffect(this, 1, 0.5, 0.8);
    }

    update(time, delta) {
        super.update(time, delta);
    }
}
