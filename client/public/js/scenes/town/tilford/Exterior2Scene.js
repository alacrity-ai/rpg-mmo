import BaseTownScene from '../BaseTownScene.js';
import SoundFXManager from '../../../audio/SoundFXManager.js';
import { fadeTransition } from '../../utils/SceneTransitions.js';
import FogEffect from '../../../graphics/FogEffect.js';

export default class TilfordExterior2Scene extends BaseTownScene {
    constructor() {
        super('TilfordExterior2Scene', 'tilford/exterior-2.png', 'tilford_town_theme.mp3', null, null, {up: 'TilfordExterior3Scene', down: 'TilfordExterior1Scene'});
    }

    preload() {
        super.preload();
        // Add additional preload logic here
    }

    create() {
        super.create();

        // Add links to other scenes
        this.interactiveZoneManager.createInteractiveArea(400, 300, 200, 150, 'Arcanium', () => {
            SoundFXManager.playSound('assets/sounds/door_open.wav');
            fadeTransition(this, 'TilfordArcaniumScene', 500);
        });

        // Add links to other scenes
        this.interactiveZoneManager.createInteractiveArea(135, 307, 125, 170, 'Apothecary', () => {
            SoundFXManager.playSound('assets/sounds/door_open.wav');
            fadeTransition(this, 'TilfordApothecaryScene', 500);
        });

        // Add links to other scenes
        this.interactiveZoneManager.createInteractiveArea(670, 350, 250, 170, 'Blacksmith', () => {
            SoundFXManager.playSound('assets/sounds/door_open.wav');
            fadeTransition(this, 'TilfordBlacksmithScene', 500);
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
