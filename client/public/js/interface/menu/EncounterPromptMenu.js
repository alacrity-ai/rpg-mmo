import { BaseMenu } from './BaseMenu.js';
import api from '../../api';
import { fadeTransition } from '../../scenes/utils/SceneTransitions.js';
import BattleScene from '../../scenes/BattleScene.js';
import AreaScene from '../../scenes/AreaScene.js';

export default class EncounterPromptMenu extends BaseMenu {
    constructor(scene, areaInstanceId, width = 400, height = 300) {
        const x = scene.sys.game.config.width / 2;
        const y = scene.sys.game.config.height / 2;
        const backgroundColor = 0x000000;
        const backgroundAlpha = 0.8;
        const borderRadius = 10;

        super(scene, x, y, width, height, backgroundColor, backgroundAlpha, borderRadius);

        this.areaInstanceId = areaInstanceId;
        this.createEncounterPromptMenu();
    }

    createEncounterPromptMenu() {
        // Add title
        const titleY = this.y - this.height / 2 + 40;
        this.addTextArea(this.x - this.width / 2 + 30, titleY, this.width - 20, 40, 'A hostile presence is detected', { fontSize: '24px', fill: '#fff' });

        // Add description
        const descriptionY = titleY + 60;
        this.addTextArea(this.x - this.width / 2 + 30, descriptionY, this.width - 40, 60, 'You have encountered an enemy. What would you like to do?', { fontSize: '16px', fill: '#fff' });

        // Add Battle button
        const battleButtonY = this.y + this.height / 2 - 70;
        this.addButton(this.x - 80, battleButtonY, 80, 30, 'Battle', () => this.startBattle(), null, 0, 0x555555, '#fff', 10);

        // Add Retreat button
        const retreatButtonY = this.y + this.height / 2 - 70;
        this.addButton(this.x + 80, retreatButtonY, 80, 30, 'Retreat', () => this.retreat(), null, 0, 0x555555, '#fff', 10);
    }

    startBattle() {
        api.battle.getBattleInstance(this.areaInstanceId)
            .then((response) => {
                console.log('Battle instance response:', response);
                const { battleInstance, battlerInstances } = response;
                const battleKey = `BattleScene_${battleInstance.id}`;
                const battleScene = new BattleScene(battleKey, battleInstance, battlerInstances);
                this.scene.scene.add(battleKey, battleScene, false);
                fadeTransition(this.scene, battleKey);
                this.hide();
            })
            .catch((error) => {
                console.error('Error starting battle:', error);
                this.hide();
            });
    }
    
    retreat() {
        // Placeholder function for retreating
        console.log('Retreating from this area:', this.areaInstanceId);
        api.zone.requestRetreat()
        .then((response) => {
            // Construct the areaKey from the response
            console.log(response);
            const { zoneId, previousAreaId, areaInstance } = response;
            const areaKey = `AreaScene_${zoneId}_${previousAreaId}`;
            // const areaInstanceData = response.areaInstance;

            const areaScene = new AreaScene(areaKey, areaInstance);
            this.scene.scene.add(areaKey, areaScene, false);

            // Use the fadeTransition to go to the new scene
            fadeTransition(this.scene, areaKey);
        })
        .catch((error) => {
            console.error('Error requesting zone:', error);
        });
        this.hide();
    }
}
