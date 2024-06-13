import { BaseMenu } from './BaseMenu.js';

export default class AreaMapMenu extends BaseMenu {
    constructor(scene, x, y, scale = 1) {
        const width = 230 * scale;
        const height = 230 * scale;
        super(scene, x, y, width, height, 0x000000, 0.8, 24 * scale, null, null, false);
        this.scale = scale;
        this.gridSize = 12;
        this.grid = Array.from({ length: this.gridSize }, () => Array(this.gridSize).fill(null));
    }

    /**
     * Sets up the area map based on the provided area data and player location.
     *
     * @param {Object} areaData - The area data object.
     * @param {number|null} areaData[].north - The area to the north, or null if there is no area.
     * @param {number|null} areaData[].south - The area to the south, or null if there is no area.
     * @param {number|null} areaData[].east - The area to the east, or null if there is no area.
     * @param {number|null} areaData[].west - The area to the west, or null if there is no area.
     * @param {string} areaData[].type - The type of the current area (e.g., 'entrance', 'area', 'exit').
     * @param {number} [playerArea=1] - The ID of the area where the player is located.
     */
    setupAreaMap(areaData, playerArea = 1, debug = false) {
        const buttonSize = 20 * this.scale; // Reduced button size
        const labelSize = `${16 * this.scale}px`; // Adjusted label size
        const offset = buttonSize + 5 * this.scale; // Distance between areas
        const asciiSquare = '■';

        // Determine the center of the grid
        const centerX = Math.floor(this.gridSize / 2);
        const centerY = Math.floor(this.gridSize / 2);

        const placeButton = (area, x, y, color, text) => {
            const adjustedX = this.x + (x - centerX) * offset;
            const adjustedY = this.y + (y - centerY) * offset;
            this.addButton(adjustedX, adjustedY, buttonSize, buttonSize, text, null, `Area ${area}`, 0, color, '#fff', 10 * this.scale, labelSize, true);
        };

        // Initialize a queue for BFS and set to track visited areas
        const queue = [{ area: Object.keys(areaData)[0], x: centerX, y: centerY }];
        const visited = new Set();

        // Perform BFS to place all areas
        while (queue.length > 0) {
            const { area, x, y } = queue.shift();
            if (visited.has(area)) continue;

            visited.add(area);
            this.grid[y][x] = area;

            const data = areaData[area];
            const color = area == playerArea ? 0x00FF00 : data.type === 'entrance' ? 0x800080 : data.type === 'exit' ? 0xFFFF00 : 0x555555;
            // if debug, placeButton with area number, else placeButton with asciiSquare
            const buttonText = debug ? area : asciiSquare;
            placeButton(area, x, y, color, buttonText);

            if (data.north !== null && y - 1 >= 0 && !visited.has(data.north) && areaData.hasOwnProperty(data.north)) {
                queue.push({ area: data.north, x, y: y - 1 });
            }
            if (data.south !== null && y + 1 < this.gridSize && !visited.has(data.south) && areaData.hasOwnProperty(data.south)) {
                queue.push({ area: data.south, x, y: y + 1 });
            }
            if (data.east !== null && x + 1 < this.gridSize && !visited.has(data.east) && areaData.hasOwnProperty(data.east)) {
                queue.push({ area: data.east, x: x + 1, y });
            }
            if (data.west !== null && x - 1 >= 0 && !visited.has(data.west) && areaData.hasOwnProperty(data.west)) {
                queue.push({ area: data.west, x: x - 1, y });
            }
        }
    }
}
