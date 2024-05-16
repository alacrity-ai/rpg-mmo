export default class PointLightSource {
    constructor(scene, x, y, color = 0xffffff, radius = 128, intensity = 1, pulsate = false, minIntensity = 0.02, maxIntensity = 0.15, pulseSpeed = 0.005) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = radius;
        this.intensity = intensity;
        this.pulsate = pulsate;
        this.minIntensity = minIntensity;
        this.maxIntensity = maxIntensity;
        this.pulseSpeed = pulseSpeed; // Initialize the pulse speed
        this.time = 0; // Initialize a time variable for pulsation effect

        // Create the point light source
        this.createPointLightSource();
    }

    createPointLightSource() {
        // Create the point light at the given coordinates with the specified properties
        this.pointLight = this.scene.add.pointlight(this.x, this.y, this.color, this.radius, this.intensity);
    }

    update(delta) {
        if (this.pulsate) {
            this.time += delta; // Update time

            // Calculate new intensity using a sinusoidal function
            const normalizedSin = (Math.sin(this.time * this.pulseSpeed) + 1) / 2; // Normalize sin output to [0, 1]
            const intensityRange = this.maxIntensity - this.minIntensity; // Calculate the range of intensity
            const newIntensity = this.minIntensity + normalizedSin * intensityRange; // Scale and shift to desired range

            // Update the point light properties
            this.pointLight.intensity = newIntensity;
        }
    }

    updatePosition(x, y) {
        this.pointLight.setPosition(x, y);
    }

    updateProperties(color, radius, intensity, minIntensity, maxIntensity, pulseSpeed) {
        this.pointLight.setColor(color);
        this.pointLight.setRadius(radius);
        this.pointLight.intensity = intensity;
        this.minIntensity = minIntensity;
        this.maxIntensity = maxIntensity;
        this.pulseSpeed = pulseSpeed; // Update the pulse speed
    }
}
