// scenes/WorldmapScene.js
import Phaser from 'phaser';
import { indexFromSceneKey } from '../interface/worldmap/MapMarkers.js';
import MapMarker from '../interface/worldmap/MapMarker.js';
import CustomCursor from '../interface/CustomCursor.js';
import WorldmapZoomMenu from '../interface/menu/WorldmapZoomMenu.js';
import Debug from '../interface/Debug.js';
import FogEffect from '../graphics/FogEffect.js';
import SoundFXManager from '../audio/SoundFXManager.js';
import api from '../api';

export default class WorldmapScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WorldmapScene' });
        this.isDragging = false;
        this.zoomLevel = 1;
        this.mapOffsetX = 0;
        this.mapOffsetY = 0;
        this.innerPadding = 0; // Adjust padding as needed
        this.currentState = 'zoomed'; // Default state
        this.mapMarkers = [];
    }

    init(data) {
        const currentMarkerIndex = indexFromSceneKey(this.registry.get('currentSceneKey'));
        this.currentLocationIndex = currentMarkerIndex || 0; // Default to first marker if not provided
    }

    preload() {
        // Load world map and marker assets
        this.load.image('worldmap', 'assets/images/ui/worldmap/worldmap.png');
        this.load.image('mapmarker_green', 'assets/images/ui/worldmap/mapmarker_green.png');
        this.load.image('mapmarker_blue', 'assets/images/ui/worldmap/mapmarker_blue.png');
        this.load.image('mapmarker_red', 'assets/images/ui/worldmap/mapmarker_red.png');
        this.load.image('mapmarker_gold', 'assets/images/ui/worldmap/mapmarker_gold.png');

        // Load server settings
        api.zone.requestWorldmap()
        .then((response) => {
            this.mapMarkers = response.filteredMapMarkersMap;
            console.log(this.mapMarkers);
        })
        .catch((error) => {
            console.error('Error getting server settings:', error);
        });
    }

    create() {
        this.currentState = 'zoomed'; // Default state

        // Initialize the SoundFXManager
        SoundFXManager.initialize(this);

        // Render the world map as background
        this.worldmap = this.add.image(0, 0, 'worldmap').setOrigin(0).setInteractive();
        this.textures.get('worldmap').setFilter(Phaser.Textures.FilterMode.NEAREST);

        // Add the fog effect
        this.fogEffect = new FogEffect(this, 1, 0.5, 0.8);

        // Initialize markers array
        this.markers = [];

        // Calculate initial position for zooming in on the user's current location
        const marker = this.mapMarkers[this.currentLocationIndex];
        this.zoomToLocation(marker.x, marker.y);

        // Render map markers
        this.markers = this.mapMarkers.map(markerData => {
            if (markerData.sceneKey === this.registry.get('currentSceneKey')) {
                return new MapMarker(this, markerData.x, markerData.y, 'gold', markerData.text, markerData.sceneKey);
            } else {
                return new MapMarker(this, markerData.x, markerData.y, markerData.type, markerData.text, markerData.sceneKey);
            }
        });

        // Enable dragging for scrolling around the map
        this.input.on('pointermove', this.handleDrag, this);
        this.input.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown() && this.currentState === 'zoomed') {
                this.isDragging = true;
                this.dragStartX = pointer.x;
                this.dragStartY = pointer.y;
                this.mapStartX = this.worldmap.x;
                this.mapStartY = this.worldmap.y;
            }
        });
        this.input.on('pointerup', () => {
            this.isDragging = false;
        });

        // Add the zoom menu
        this.zoomMenu = new WorldmapZoomMenu(this, this.currentLocationIndex);

        // Initialize the Debug class
        this.debug = new Debug(this);

        // Get CustomCursor instance
        CustomCursor.getInstance(this);

        // Hide the fog if zoomed in
        if (this.currentState === 'zoomed') {
            this.fogEffect.hide();
        }
    }

    handleDrag(pointer) {
        if (this.isDragging && this.currentState === 'zoomed') {
            const dragX = pointer.x - this.dragStartX;
            const dragY = pointer.y - this.dragStartY;
            this.worldmap.x = Phaser.Math.Clamp(this.mapStartX + dragX, this.getMinX(), this.getMaxX());
            this.worldmap.y = Phaser.Math.Clamp(this.mapStartY + dragY, this.getMinY(), this.getMaxY());

            // Adjust the position of the markers based on the map's position
            this.updateMarkers();
        }
    }

    getMinX() {
        return this.cameras.main.width - this.worldmap.displayWidth + this.innerPadding;
    }

    getMaxX() {
        return -this.innerPadding;
    }

    getMinY() {
        return this.cameras.main.height - this.worldmap.displayHeight + this.innerPadding;
    }

    getMaxY() {
        return -this.innerPadding;
    }

    updateMarkers() {
        if (this.markers && Array.isArray(this.markers)) {
            const isZoomedOut = this.currentState === 'entire';
            this.markers.forEach(marker => {
                marker.marker.setVisible(true); // Show all markers when zoomed in
                marker.updatePosition(this.worldmap.x, this.worldmap.y, this.zoomLevel);
                marker.updateScale(isZoomedOut); // Adjust the scale based on the current state
            });
        }
    }

    zoomToLocation(x, y) {
        // Set initial zoom level and position
        this.zoomLevel = 3; // Example zoom level, adjust as needed
        this.worldmap.setScale(this.zoomLevel);

        // Calculate the initial offset based on the zoom level
        let initialOffsetX = this.cameras.main.width / 2 - x * this.zoomLevel;
        let initialOffsetY = this.cameras.main.height / 2 - y * this.zoomLevel;

        // Clamp the initial position to be within the allowed boundaries
        this.mapOffsetX = Phaser.Math.Clamp(initialOffsetX, this.getMinX(), this.getMaxX());
        this.mapOffsetY = Phaser.Math.Clamp(initialOffsetY, this.getMinY(), this.getMaxY());

        this.worldmap.setPosition(this.mapOffsetX, this.mapOffsetY);

        // Update markers
        this.updateMarkers();
    }

    viewEntireMap() {
        this.currentState = 'entire';
        this.isDragging = false;

        // Zoom out to view the entire map
        this.zoomLevel = 1; // Adjust zoom level for entire map view
        this.worldmap.setScale(this.zoomLevel);

        // Show the fog
        this.fogEffect.show();

        // Center the map
        let centerX = (this.cameras.main.width - this.worldmap.displayWidth) / 2;
        let centerY = (this.cameras.main.height - this.worldmap.displayHeight) / 2;
        this.worldmap.setPosition(centerX, centerY);

        // Update markers
        this.updateMarkers();
    }

    viewZoomedMap() {
        this.currentState = 'zoomed';

        // Hide the fog
        this.fogEffect.hide();

        // Zoom in on the user's current location
        const marker = this.mapMarkers[this.currentLocationIndex];
        this.zoomToLocation(marker.x, marker.y);
    }

    update(time, delta) {
        // // Update custom cursor position
        // CustomCursor.getInstance(this).update();

        // Update fog effect
        this.fogEffect.update(time, delta);

        // Update debug coordinates
        this.debug.update(this.input.activePointer);
    }

    cleanup() {
        // Clean up any resources here
    }
    
}
