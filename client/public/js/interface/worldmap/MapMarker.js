// interface/worldmap/MapMarker.js

import { fadeTransition } from '../../scenes/utils/SceneTransitions.js';
import AreaScene from '../../scenes/AreaScene.js';
import SoundFXManager from '../../audio/SoundFXManager.js'
import api from '../../api';

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
            // Play hover sound effect
            SoundFXManager.playSound('assets/sounds/menu/ui_1.wav');

            // Display hover text
            this.hoverText = scene.add.text(this.marker.x, this.textY, text, { font: '16px Arial', fill: '#ffffff' }).setOrigin(0.5);
            
            // Start looping animation
            this.hoverTween = this.scene.tweens.add({
                targets: this.marker,
                y: this.marker.y + 6,
                yoyo: true,
                repeat: -1,
                duration: 500,
                ease: 'Sine.easeInOut'
            });
        });

        this.marker.on('pointerout', () => {
            // Remove hover text
            if (this.hoverText) {
                this.hoverText.destroy();
            }
            // Stop looping animation
            if (this.hoverTween) {
                this.hoverTween.stop();
                this.marker.y = this.originalY * this.scene.zoomLevel + this.scene.worldmap.y; // Reset marker position
            }
        });

        this.marker.on('pointerdown', () => {
            SoundFXManager.playSound('assets/sounds/footstep_chain.wav');
            if (this.type === 'blue') {
                // Transition to the specified scene
                fadeTransition(this.scene, sceneKey);
            } else if (this.type === 'green') {
                // Call the requestZone api endpoint
                api.zone.requestZone(this.sceneKey)
                    .then((response) => {
                        console.log('Zone request response:', response);
                        // Extract the areaInstance data from the response
                        const areaInstanceData = response.areaInstance;
                        // Clear the area connections registry key
                        this.scene.registry.set('areaConnections', {});
                        // Generate a unique key for the new AreaScene
                        const areaKey = `AreaScene_${areaInstanceData.zoneInstanceId}_${areaInstanceData.id}`;
                        // Add the new scene with the area instance data
                        const areaScene = new AreaScene(areaKey, areaInstanceData);
                        // Add the scene to the Phaser game instance and start it
                        this.scene.scene.add(areaKey, areaScene, false);
                        // Use the fadeTransition to go to the new scene
                        fadeTransition(this.scene, areaKey);
                    })
                    .catch((error) => {
                        console.error('Error requesting zone:', error);
                    });
            }
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
