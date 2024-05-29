import BaseTownScene from '../BaseTownScene.js';
import SoundFXManager from '../../../audio/SoundFXManager.js';
import { fadeTransition } from '../../utils/SceneTransitions.js';
import FogEffect from '../../../graphics/FogEffect.js';

export default class FrostholmExterior3Scene extends BaseTownScene {
    constructor() {
        super('FrostholmExterior3Scene', 'frostholm/exterior-3.png', 'frostholm_town_theme.mp3', null, null, {down: 'FrostholmExterior2Scene'});
    }

    preload() {
        super.preload();
        // Add additional preload logic here
    }

    create() {
        super.create();

        // Add links to other scenes
        this.interactiveZoneManager.createInteractiveArea(160, 320, 200, 150, 'Leatherworker', () => {
            SoundFXManager.playSound('assets/sounds/door_open.wav');
            fadeTransition(this, 'FrostholmLeatherworkerScene', 500);
        });

        // Add links to other scenes
        this.interactiveZoneManager.createInteractiveArea(700, 340, 300, 200, 'Market', () => {
            SoundFXManager.playSound('assets/sounds/door_open.wav');
            fadeTransition(this, 'FrostholmMarketScene', 500);
        });

        // Add links to other scenes
        this.interactiveZoneManager.createInteractiveArea(400, 300, 200, 100, 'Guild Hall', () => {
            SoundFXManager.playSound('assets/sounds/door_open_2.wav');
            fadeTransition(this, 'FrostholmGuildhallScene', 500);
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
