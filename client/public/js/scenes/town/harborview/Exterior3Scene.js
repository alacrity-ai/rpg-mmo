import BaseTownScene from '../BaseTownScene.js';
import SoundFXManager from '../../../audio/SoundFXManager.js';
import { fadeTransition } from '../../utils/SceneTransitions.js';
import FogEffect from '../../../graphics/FogEffect.js';

export default class HarborviewExterior3Scene extends BaseTownScene {
    constructor() {
        super('HarborviewExterior3Scene', 'harborview/exterior-3.png', 'harborview_town_theme.mp3', null, null, {right: 'HarborviewExterior1Scene'});
    }

    preload() {
        super.preload();
        // Add additional preload logic here
    }

    create() {
        super.create();

        // Add links to other scenes
        this.interactiveZoneManager.createInteractiveArea(330, 200, 260, 120, 'Gemcutter', () => {
            SoundFXManager.playSound('assets/sounds/door_open.wav');
            fadeTransition(this, 'HarborviewGemcutterScene');
        });


        // Add the fog effect
        this.fogEffect = new FogEffect(this, 1, 0.3, 0.8);
    }

    update(time, delta) {
        super.update(time, delta);
    }
}
