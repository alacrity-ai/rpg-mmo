import BaseTownScene from '../BaseTownScene.js';
import SoundFXManager from '../../../audio/SoundFXManager.js';
import { fadeTransition } from '../../utils/SceneTransitions.js';
import FogEffect from '../../../graphics/FogEffect.js';

export default class HarborviewExterior2Scene extends BaseTownScene {
    constructor() {
        super('HarborviewExterior2Scene', 'harborview/exterior-2.png', 'harborview_town_theme.mp3', null, null, {left: 'HarborviewExterior1Scene', up: 'HarborviewMarketScene'});
    }

    preload() {
        super.preload();
        // Add additional preload logic here
    }

    create() {
        super.create();

        // Add links to other scenes
        this.interactiveZoneManager.createInteractiveArea(400, 300, 200, 150, 'Guildhall', () => {
            SoundFXManager.playSound('assets/sounds/door_open.wav');
            fadeTransition(this, 'HarborviewGuildhallScene');
        });

        // Add the fog effect
        this.fogEffect = new FogEffect(this, 1, 0.3, .8);

        // // Add pulsating point lights
        this.pointLightManager.addPointLight(462, 325, 0xffaa00, 35, 0.02, true, 0.09, 0.18, 0.002);
        this.pointLightManager.addPointLight(580, 326, 0xffaa00, 35, 0.02, true, 0.09, 0.18, 0.003);
        this.pointLightManager.addPointLight(977, 373, 0xffdab9, 105, 0.01, true, 0.09, 0.14, 0.002);

        // Add the fog effect
        this.fogEffect = new FogEffect(this, 1, 0.5, 0.8);
    }

    update(time, delta) {
        super.update(time, delta);
    }
}
