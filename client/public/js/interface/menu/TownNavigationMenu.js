import { BaseMenu } from './BaseMenu.js';
import { fadeTransition } from '../../scenes/utils/SceneTransitions.js';

export default class TownNavigationMenu extends BaseMenu {
    constructor(scene, x = null, y = null, scale = 1) {
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
    }

    setupTownNavigationButtons(up = null, down = null, left = null, right = null) {
        const buttonSize = 30 * this.scale;
        const labelSize = `${24 * this.scale}px`;
        const offset = buttonSize / 2 + 16 * this.scale;

        // North
        if (up !== null) {
            this.addButton(this.x, this.y - offset, buttonSize, buttonSize, '↑', () => fadeTransition(this.scene, up), 'Travel North', 0, 0x555555, '#fff', 10 * this.scale, labelSize, false, 'assets/sounds/footstep_chain.wav');
        } else {
            this.addButton(this.x, this.y - offset, buttonSize, buttonSize, '↑', null, 'No Travel North', 0, 0x555555, '#888', 10 * this.scale, labelSize, true);
        }

        // South
        if (down !== null) {
            this.addButton(this.x, this.y + offset, buttonSize, buttonSize, '↓', () => fadeTransition(this.scene, down), 'Travel South', 0, 0x555555, '#fff', 10 * this.scale, labelSize, false, 'assets/sounds/footstep_chain.wav');
        } else {
            this.addButton(this.x, this.y + offset, buttonSize, buttonSize, '↓', null, 'No Travel South', 0, 0x555555, '#888', 10 * this.scale, labelSize, true);
        }

        // West
        if (left !== null) {
            this.addButton(this.x - offset, this.y, buttonSize, buttonSize, '←', () => fadeTransition(this.scene, left), 'Travel West', 0, 0x555555, '#fff', 10 * this.scale, labelSize, false, 'assets/sounds/footstep_chain.wav');
        } else {
            this.addButton(this.x - offset, this.y, buttonSize, buttonSize, '←', null, 'No Travel West', 0, 0x555555, '#888', 10 * this.scale, labelSize, true);
        }

        // East
        if (right !== null) {
            this.addButton(this.x + offset, this.y, buttonSize, buttonSize, '→', () => fadeTransition(this.scene, right), 'Travel East', 0, 0x555555, '#fff', 10 * this.scale, labelSize, false, 'assets/sounds/footstep_chain.wav');
        } else {
            this.addButton(this.x + offset, this.y, buttonSize, buttonSize, '→', null, 'No Travel East', 0, 0x555555, '#888', 10 * this.scale, labelSize, true);
        }

        // Attach WASD key listeners for navigation
        this.attachMoveKeysListener(up, down, left, right);
    }

    attachMoveKeysListener(up, down, left, right) {
        this.scene.input.keyboard.on('keydown-W', () => {
            if (up !== null) {
                fadeTransition(this.scene, up);
            }
        });

        this.scene.input.keyboard.on('keydown-A', () => {
            if (left !== null) {
                fadeTransition(this.scene, left);
            }
        });

        this.scene.input.keyboard.on('keydown-S', () => {
            if (down !== null) {
                fadeTransition(this.scene, down);
            }
        });

        this.scene.input.keyboard.on('keydown-D', () => {
            if (right !== null) {
                fadeTransition(this.scene, right);
            }
        });
    }
}
