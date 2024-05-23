import { BaseMenu } from './BaseMenu.js';

export default class NavigationMenu extends BaseMenu {
    constructor(scene, x, y, scale = 1) {
        const width = 112 * scale;
        const height = 112 * scale;
        super(scene, x, y, width, height, 0x000000, 0.8, 24 * scale, null, null, false);
        this.scale = scale;
    }
    /**
     * Sets up the navigation buttons based on the provided navigation data.
     *
     * @param {Object} navigationData - The navigation data object.
     * @param {number|null} navigationData.north - The area to the north, or null if there is no area.
     * @param {number|null} navigationData.south - The area to the south, or null if there is no area.
     * @param {number|null} navigationData.east - The area to the east, or null if there is no area.
     * @param {number|null} navigationData.west - The area to the west, or null if there is no area.
     * @param {string} navigationData.type - The type of the current area (e.g., 'entrance', 'area').
     */
    setupNavigationButtons(navigationData) {
        const buttonSize = 30 * this.scale;
        const labelSize = `${24 * this.scale}px`;
        const offset = buttonSize / 2 + 16 * this.scale;

        const upCallback = () => console.log('Up button clicked');
        const downCallback = () => console.log('Down button clicked');
        const leftCallback = () => console.log('Left button clicked');
        const rightCallback = () => console.log('Right button clicked');

        // North
        if (navigationData.north !== null) {
            this.addButton(this.x, this.y - offset, buttonSize, buttonSize, '↑', upCallback, 'Travel North', 0, 0x555555, '#fff', 10 * this.scale, labelSize);
        } else {
            this.addButton(this.x, this.y - offset, buttonSize, buttonSize, '↑', null, 'No Travel North', 0, 0x555555, '#888', 10 * this.scale, labelSize, true);
        }

        // South
        if (navigationData.south !== null) {
            this.addButton(this.x, this.y + offset, buttonSize, buttonSize, '↓', downCallback, 'Travel South', 0, 0x555555, '#fff', 10 * this.scale, labelSize);
        } else {
            this.addButton(this.x, this.y + offset, buttonSize, buttonSize, '↓', null, 'No Travel South', 0, 0x555555, '#888', 10 * this.scale, labelSize, true);
        }

        // West
        if (navigationData.west !== null) {
            this.addButton(this.x - offset, this.y, buttonSize, buttonSize, '←', leftCallback, 'Travel West', 0, 0x555555, '#fff', 10 * this.scale, labelSize);
        } else {
            this.addButton(this.x - offset, this.y, buttonSize, buttonSize, '←', null, 'No Travel West', 0, 0x555555, '#888', 10 * this.scale, labelSize, true);
        }

        // East
        if (navigationData.east !== null) {
            this.addButton(this.x + offset, this.y, buttonSize, buttonSize, '→', rightCallback, 'Travel East', 0, 0x555555, '#fff', 10 * this.scale, labelSize);
        } else {
            this.addButton(this.x + offset, this.y, buttonSize, buttonSize, '→', null, 'No Travel East', 0, 0x555555, '#888', 10 * this.scale, labelSize, true);
        }
    }
}
