// sceneObjects/weather.js
export class Weather {
    constructor(fog = false, fogBrightness = 0.5, fogThickness = 0.5, fogSpeed = 5) {
      this.fog = fog;
      this.fogBrightness = fogBrightness;
      this.fogThickness = fogThickness;
      this.fogSpeed = fogSpeed;
    }
  }
  