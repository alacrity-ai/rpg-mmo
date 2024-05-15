// js/interface/IconHelper.js
import IconConfig from './IconConfig.js';

export default class IconHelper {
    constructor(scene, spriteSheetKey) {
        this.scene = scene;
        this.spriteSheetKey = spriteSheetKey;
    }

    getIcon(name) {
        const { x, y } = IconConfig[name];
        const frameNumber = y * 32 + x;

        const icon = this.scene.add.rexCircleMaskImage(0, 0, this.spriteSheetKey, frameNumber, {
            maskType: 2, // Round rectangle mask
            radius: 8    // Adjust the radius as needed
        });

        return icon;
    }
}
