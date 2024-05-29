import BaseTownScene from '../BaseTownScene.js';
import SoundFXManager from '../../../audio/SoundFXManager.js';
import { fadeTransition } from '../../utils/SceneTransitions.js';
import FogEffect from '../../../graphics/FogEffect.js';

export default class GlaciersedgeExterior1Scene extends BaseTownScene {
    constructor() {
        super('GlaciersedgeExterior1Scene', 'glaciersedge/exterior-1.png', 'glaciersedge_town_theme.mp3', null, null);
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
        this.interactiveZoneManager.createInteractiveArea(307, 307, 110, 100, 'Blacksmith', () => {
            SoundFXManager.playSound('assets/sounds/menu/ui_2.wav');
            fadeTransition(this, 'GlaciersedgeBlacksmithScene', 500);
        });

        this.interactiveZoneManager.createInteractiveArea(630, 344, 150, 110, 'Guildhall', () => {
            SoundFXManager.playSound('assets/sounds/menu/ui_2.wav');
            fadeTransition(this, 'GlaciersedgeGuildhallScene', 500);
        });

        // Add the fog effect
        this.fogEffect = new FogEffect(this, 1, 0.45, 0.8);
    }

    update(time, delta) {
        super.update(time, delta);
    }
}
