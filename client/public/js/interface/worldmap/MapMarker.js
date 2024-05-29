// interface/worldmap/MapMarker.js

import { fadeTransition } from '../../scenes/utils/SceneTransitions.js'

export default class MapMarker {
    constructor(scene, x, y, type, text, sceneKey) {
        this.scene = scene;
        this.originalX = x;
        this.originalY = y;
        this.type = type;
        this.text = text;
        this.sceneKey = sceneKey;

        // Load the correct marker image based on type
        const markerImage = `mapmarker_${type}`;
        this.marker = scene.add.image(0, 0, markerImage).setInteractive();
        this.marker.setOrigin(0.5, 1); // Set origin to bottom middle

        // Ensure pixel-perfect rendering
        this.scene.textures.get(markerImage).setFilter(Phaser.Textures.FilterMode.NEAREST);

        // Set up pointer events
        this.marker.on('pointerover', () => {
            // Display hover text
            this.hoverText = scene.add.text(this.marker.x, this.textY, text, { font: '16px Arial', fill: '#ffffff' }).setOrigin(0.5);
        });

        this.marker.on('pointerout', () => {
            // Remove hover text
            if (this.hoverText) {
                this.hoverText.destroy();
            }
        });

        this.marker.on('pointerdown', () => {
            // Transition to the specified scene
            fadeTransition(this.scene, sceneKey);
        });

        this.updatePosition(scene.worldmap.x, scene.worldmap.y, scene.zoomLevel);
        this.textY = this.marker.y - 40;
    }

    updatePosition(mapX, mapY, zoomLevel) {
        this.marker.x = mapX + this.originalX * zoomLevel;
        this.marker.y = mapY + this.originalY * zoomLevel;
    }

    updateScale(isZoomedOut) {
        if (isZoomedOut) {
            this.textY = this.marker.y - 24;
            this.marker.setScale(0.5); // Render at half size when zoomed out
        } else {
            this.textY = this.marker.y - 40;
            this.marker.setScale(1); // Render at full size when zoomed in
        }
    }
}
