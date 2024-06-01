import { BaseMenu } from './BaseMenu.js';
import { fadeTransition } from '../../scenes/utils/SceneTransitions.js';
import api from '../../api';
import AreaScene from '../../scenes/AreaScene.js';
import SoundFXManager from '../../audio/SoundFXManager.js';

export default class AreaNavigationMenu extends BaseMenu {
    constructor(scene, currentAreaId, x = null, y = null, scale = 1) {
        const width = 112 * scale;
        const height = 112 * scale;
        // If x is null, use this.sys.game.config.width / 14
        x = x || scene.sys.game.config.width / 14 + 5;
        // If y is null, use this.sys.game.config.height / 1.4
        y = y || scene.sys.game.config.height / 1.4 + 30;
        super(scene, x, y, width, height, 0x000000, 0.8, 24 * scale, null, null, false, false);
        // Add a window manually
        const window = this.addWindow(x, y, width, height, 0x000000, 0.8, 24 * scale);
        window.setDepth(90);
        this.scale = scale;
        this.currentAreaId = currentAreaId;
    }

    /* Sets up the navigation buttons for an area scene.
     * @param {Object} areaConnections - The area connections from the current area.
     * */
    setupAreaNavigationButtons(areaConnections) {
        const buttonSize = 30 * this.scale;
        const labelSize = `${24 * this.scale}px`;
        const offset = buttonSize / 2 + 16 * this.scale;

        // North
        if (areaConnections.north !== null) {
            this.addButton(this.x, this.y - offset, buttonSize, buttonSize, 'N', () => this.requestAreaChange(areaConnections.north), 'Travel North', 0, 0x555555, '#fff', 10 * this.scale, labelSize, false, null);
        } else {
            this.addButton(this.x, this.y - offset, buttonSize, buttonSize, 'N', null, 'No Travel North', 0, 0x555555, '#888', 10 * this.scale, labelSize, true);
        }

        // South
        if (areaConnections.south !== null) {
            this.addButton(this.x, this.y + offset, buttonSize, buttonSize, 'S', () => this.requestAreaChange(areaConnections.south), 'Travel South', 0, 0x555555, '#fff', 10 * this.scale, labelSize, false, null);
        } else {
            this.addButton(this.x, this.y + offset, buttonSize, buttonSize, 'S', null, 'No Travel South', 0, 0x555555, '#888', 10 * this.scale, labelSize, true);
        }

        // West
        if (areaConnections.west !== null) {
            this.addButton(this.x - offset, this.y, buttonSize, buttonSize, 'W', () => this.requestAreaChange(areaConnections.west), 'Travel West', 0, 0x555555, '#fff', 10 * this.scale, labelSize, false, null);
        } else {
            this.addButton(this.x - offset, this.y, buttonSize, buttonSize, 'W', null, 'No Travel West', 0, 0x555555, '#888', 10 * this.scale, labelSize, true);
        }

        // East
        if (areaConnections.east !== null) {
            this.addButton(this.x + offset, this.y, buttonSize, buttonSize, 'E', () => this.requestAreaChange(areaConnections.east), 'Travel East', 0, 0x555555, '#fff', 10 * this.scale, labelSize, false, null);
        } else {
            this.addButton(this.x + offset, this.y, buttonSize, buttonSize, 'E', null, 'No Travel East', 0, 0x555555, '#888', 10 * this.scale, labelSize, true);
        }
    }

    requestAreaChange(targetAreaId) {
        api.zone.requestArea(this.currentAreaId, targetAreaId)
            .then((response) => {
                console.log('Area request response:', response);
                const areaInstanceData = response.areaInstance;
                const areaKey = `AreaScene_${areaInstanceData.zoneInstanceId}_${areaInstanceData.id}`;
                const areaScene = new AreaScene(areaKey, areaInstanceData);
                this.scene.scene.add(areaKey, areaScene, false);
                SoundFXManager.playSound('assets/sounds/footstep_chain.wav');
                fadeTransition(this.scene, areaKey);
            })
            .catch((error) => {
                console.error('Error requesting area:', error);
            });
    }
}
