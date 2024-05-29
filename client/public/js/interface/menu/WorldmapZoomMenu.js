// interface/menu/WorldmapZoomMenu.js

import { BaseMenu } from './BaseMenu.js';

export default class WorldmapZoomMenu extends BaseMenu {
    constructor(scene, currentLocationIndex) {
        const x = scene.sys.game.config.width - 60; // Positioning on the bottom right
        const y = scene.sys.game.config.height - 60; // Positioning on the bottom right
        const width = 80;
        const height = 80;
        const backgroundColor = 0x000000;
        const backgroundAlpha = 0.8;
        const borderRadius = 10;

        super(scene, x, y, width, height, backgroundColor, backgroundAlpha, borderRadius);

        this.scene = scene;
        this.currentLocationIndex = currentLocationIndex;

        this.createZoomMenu();
    }

    createZoomMenu() {
        // Add Zoom In (+) button
        const zoomInButtonY = this.y - 20;
        this.addButton(this.x, zoomInButtonY, 32, 32, '+', () => this.zoomIn(), null, 0, 0x555555, '#fff', 10);

        // Also zoomIn on scrollwheel up
        this.scene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            if (deltaY < 0) {
                this.zoomIn();
            }
        });

        // Add Zoom Out (-) button
        const zoomOutButtonY = this.y + 20;
        this.addButton(this.x, zoomOutButtonY, 32, 32, '-', () => this.zoomOut(), null, 0, 0x555555, '#fff', 10);
    
        // Also zoomOut on scrollwheel down
        this.scene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            if (deltaY > 0) {
                this.zoomOut();
            }
        });
    }

    zoomIn() {
        // Change the mode to zoomed in with dragging
        this.scene.viewZoomedMap();
    }

    zoomOut() {
        // Change the mode to zoomed out
        this.scene.viewEntireMap();
    }
}
