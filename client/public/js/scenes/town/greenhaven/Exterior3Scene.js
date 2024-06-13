import BaseTownScene from '../BaseTownScene.js';
import SoundFXManager from '../../../audio/SoundFXManager.js';
import { fadeTransition } from '../../utils/SceneTransitions.js';
import FogEffect from '../../../graphics/FogEffect.js';

export default class GreenhavenExterior3Scene extends BaseTownScene {
    constructor() {
        super('GreenhavenExterior3Scene', 'greenhaven/exterior-3.png', 'greenhaven_town_theme.mp3', null, null, {right: 'GreenhavenExterior2Scene'});
    }

    preload() {
        super.preload();
        // Add additional preload logic here
    }

    create() {
        super.create();

        // Add links to other scenes
        this.interactiveZoneManager.createInteractiveArea(774, 251, 200, 200, 'Blacksmith', () => {
            SoundFXManager.playSound('assets/sounds/door_open.wav');
            fadeTransition(this, 'GreenhavenBlacksmithScene');
        });

        // Add links to other scenes
        this.interactiveZoneManager.createInteractiveArea(161, 245, 120, 120, 'Arcanium', () => {
            SoundFXManager.playSound('assets/sounds/door_open.wav');
            fadeTransition(this, 'GreenhavenArcaniumScene');
        });

        // Add links to other scenes
        this.interactiveZoneManager.createInteractiveArea(368, 172, 260, 150, 'Market', () => {
            SoundFXManager.playSound('assets/sounds/footstep_chain.wav');
            fadeTransition(this, 'GreenhavenMarketScene');
        });

        // // Add pulsating point lights
        // this.pointLightManager.addPointLight(510, 355, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.004);

    }

    update(time, delta) {
        super.update(time, delta);
    }
}
