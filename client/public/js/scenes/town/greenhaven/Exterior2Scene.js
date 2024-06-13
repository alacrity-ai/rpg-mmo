import BaseTownScene from '../BaseTownScene.js';
import SoundFXManager from '../../../audio/SoundFXManager.js';
import { fadeTransition } from '../../utils/SceneTransitions.js';
import FogEffect from '../../../graphics/FogEffect.js';

export default class GreenhavenExterior2Scene extends BaseTownScene {
    constructor() {
        super('GreenhavenExterior2Scene', 'greenhaven/exterior-2.png', 'greenhaven_town_theme.mp3', null, null, {up: 'GreenhavenExterior4Scene', down: 'GreenhavenExterior1Scene', left: 'GreenhavenExterior3Scene'});
    }

    preload() {
        super.preload();
        // Add additional preload logic here
    }

    create() {
        super.create();

        // Add links to other scenes
        this.interactiveZoneManager.createInteractiveArea(570, 200, 150, 110, 'Guildhall', () => {
            SoundFXManager.playSound('assets/sounds/footstep_chain.wav');
            fadeTransition(this, 'GreenhavenGuildhallScene');
        });

        // Add links to other scenes
        this.interactiveZoneManager.createInteractiveArea(771, 350, 100, 200, 'Apothecary', () => {
            SoundFXManager.playSound('assets/sounds/door_open.wav');
            fadeTransition(this, 'GreenhavenApothecaryScene');
        });

        // // Add pulsating point lights
        // this.pointLightManager.addPointLight(510, 355, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.004);

    }

    update(time, delta) {
        super.update(time, delta);
    }
}
