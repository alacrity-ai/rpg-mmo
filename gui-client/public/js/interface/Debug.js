export default class Debug {
    constructor(scene) {
        this.scene = scene;
        this.text = this.scene.add.text(10, 10, '', { fontSize: '16px', fill: '#fff' }).setOrigin(1, 0);
    }

    update(pointer) {
        const x = pointer.worldX.toFixed(2);
        const y = pointer.worldY.toFixed(2);
        this.text.setText(`X: ${x}, Y: ${y}`);
        this.text.setPosition(this.scene.sys.game.config.width - 10, 10);
    }
}
