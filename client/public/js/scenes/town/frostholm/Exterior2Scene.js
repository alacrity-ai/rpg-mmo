import BaseTownScene from '../BaseTownScene.js';
import SoundFXManager from '../../../audio/SoundFXManager.js';
import { fadeTransition } from '../../utils/SceneTransitions.js';
import FogEffect from '../../../graphics/FogEffect.js';

export default class FrostholmExterior2Scene extends BaseTownScene {
    constructor() {
        super('FrostholmExterior2Scene', 'frostholm/exterior-2.png', 'frostholm_town_theme.mp3', null, null, {up: 'FrostholmExterior3Scene', down: 'FrostholmExterior1Scene'});
    }

    preload() {
        super.preload();
        // Add additional preload logic here
    }

    create() {
        super.create();

        // Add links to other scenes
        this.interactiveZoneManager.createInteractiveArea(350, 250, 200, 200, 'Arcanium', () => {
            SoundFXManager.playSound('assets/sounds/door_open.wav');
            fadeTransition(this, 'FrostholmArcaniumScene', 500);
        });

        // Add links to other scenes
        this.interactiveZoneManager.createInteractiveArea(720, 220, 250, 320, 'Blacksmith', () => {
            SoundFXManager.playSound('assets/sounds/door_open.wav');
            fadeTransition(this, 'FrostholmBlacksmithScene', 500);
        });

        // Add the fog effect
        this.fogEffect = new FogEffect(this, 1, 0.3, .8);

        // // Add pulsating point lights
        // this.pointLightManager.addPointLight(510, 355, 0xffaa00, 15, 0.02, true, 0.02, 0.15, 0.004);

    }

    update(time, delta) {
        super.update(time, delta);
    }
}
