// sceneObjects/entranceObject.js

export class EntranceObject {
    constructor(x1, y1, x2, y2, sceneKey, oneWay = false, flagLock = null) {
      this.x1 = x1;
      this.y1 = y1;
      this.x2 = x2;
      this.y2 = y2;
      this.sceneKey = sceneKey;
      this.oneWay = oneWay;
      this.flagLock = flagLock;
    }
  }
  