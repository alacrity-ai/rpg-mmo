import BaseTownScene from '../BaseTownScene.js';
import SoundFXManager from '../../../audio/SoundFXManager.js';
import { fadeTransition } from '../../utils/SceneTransitions.js';
import FogEffect from '../../../graphics/FogEffect.js';

export default class HarborviewExterior1Scene extends BaseTownScene {
    constructor() {
        super('HarborviewExterior1Scene', 'harborview/exterior-1.png', 'harborview_town_theme.mp3', null, null, {left: 'HarborviewExterior3Scene', right: 'HarborviewExterior2Scene'});
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
        this.interactiveZoneManager.createInteractiveArea(50, 200, 180, 140, 'Blacksmith', () => {
            SoundFXManager.playSound('assets/sounds/door_open.wav');
            fadeTransition(this, 'HarborviewBlacksmithScene', 500);
        });

        this.interactiveZoneManager.createInteractiveArea(700, 140, 180, 150, 'Arcanium', () => {
            SoundFXManager.playSound('assets/sounds/door_open.wav');
            fadeTransition(this, 'HarborviewArcaniumScene', 500);
        });

        this.interactiveZoneManager.createInteractiveArea(260, 160, 100, 120, 'Residence', () => {
            SoundFXManager.playSound('assets/sounds/door_open.wav');
            fadeTransition(this, 'HarborviewResidence1Scene', 500);
        });

        // Add pointlight
        this.pointLightManager.addPointLight(478, 239, 0xff4500, 105, 0.21, true, 0.22, 0.44, 0.001);

        // Add the fog effect
        this.fogEffect = new FogEffect(this, 1, 0.5, 0.8);
    }

    update(time, delta) {
        super.update(time, delta);
    }
}
