export default class LightSource {
    constructor(scene, x, y, radius) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.radius = radius;

        // Create the light source
        this.createLightSource();
    }

    createLightSource() {
        // Enable the lights plugin
        this.scene.lights.enable();
        this.scene.lights.setAmbientColor(0x555555); // Set ambient light color

        // Create the light at the given coordinates with the specified radius
        this.light = this.scene.lights.addLight(this.x, this.y, this.radius).setColor(0xffaa00).setIntensity(1.5);
    }

    updatePosition(x, y) {
        this.light.setPosition(x, y);
    }

    updateRadius(radius) {
        this.light.setRadius(radius);
    }

    updateColor(color) {
        this.light.setColor(color);
    }

    updateIntensity(intensity) {
        this.light.setIntensity(intensity);
    }
}
