import BaseTownScene from '../BaseTownScene.js';
import SoundFXManager from '../../../audio/SoundFXManager.js';
import { fadeTransition } from '../../utils/SceneTransitions.js';
import FogEffect from '../../../graphics/FogEffect.js';

export default class GreenhavenExterior4Scene extends BaseTownScene {
    constructor() {
        super('GreenhavenExterior4Scene', 'greenhaven/exterior-4.png', 'greenhaven_town_theme.mp3', null, null, {down: 'GreenhavenExterior2Scene'});
    }

    preload() {
        super.preload();
        // Add additional preload logic here
    }

    create() {
        super.create();

        // Add links to other scenes
        this.interactiveZoneManager.createInteractiveArea(577, 211, 200, 100, 'Temple', () => {
            SoundFXManager.playSound('assets/sounds/footstep_chain.wav');
            fadeTransition(this, 'GreenhavenTempleScene', 500);
        });
    }

    update(time, delta) {
        super.update(time, delta);
    }
}
