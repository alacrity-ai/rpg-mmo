export default class CustomCursor {
    constructor(scene) {
        if (CustomCursor.instance) {
            CustomCursor.instance.scene = scene;
            return CustomCursor.instance;
        }

        this.scene = scene;
        CustomCursor.instance = this;
    }

    createCursor() {
        // Hide the default cursor
        this.scene.input.setDefaultCursor('none');

        // Add custom cursors
        this.customCursor = this.scene.add.image(this.scene.input.activePointer.x, this.scene.input.activePointer.y, 'cursor').setDepth(1000).setOrigin(0, 0);
        this.cursorClicked = this.scene.add.image(this.scene.input.activePointer.x, this.scene.input.activePointer.y, 'cursor_clicked').setDepth(1000).setOrigin(0, 0).setVisible(false);
        this.cursorEnter = this.scene.add.image(this.scene.input.activePointer.x, this.scene.input.activePointer.y, 'cursor_enter').setDepth(1000).setOrigin(0, 0).setVisible(false);

        // Update cursor position on pointer move
        this.scene.input.on('pointermove', this.updateCursorPosition, this);

        // Change cursor image on pointer down and up
        this.scene.input.on('pointerdown', this.onPointerDown, this);
        this.scene.input.on('pointerup', this.onPointerUp, this);
    }

    updateCursorPosition(pointer) {
        if (this.customCursor && this.cursorClicked) {
            this.customCursor.setPosition(pointer.x, pointer.y);
            this.cursorClicked.setPosition(pointer.x, pointer.y);
        }
    }

    onPointerDown() {
        if (this.customCursor && this.cursorClicked) {
            this.customCursor.setVisible(false);
            this.cursorClicked.setVisible(true);
        }
    }

    onPointerUp() {
        if (this.customCursor && this.cursorClicked) {
            this.customCursor.setVisible(true);
            this.cursorClicked.setVisible(false);
        }
    }

    recreateCursor() {
        if (this.customCursor) this.customCursor.destroy();
        if (this.cursorClicked) this.cursorClicked.destroy();
        this.createCursor();
    }

    update() {
        if (this.customCursor && this.cursorClicked) {
            this.customCursor.setPosition(this.scene.input.activePointer.x, this.scene.input.activePointer.y);
            this.cursorClicked.setPosition(this.scene.input.activePointer.x, this.scene.input.activePointer.y);
        }
    }

    static getInstance(scene) {
        if (!CustomCursor.instance) {
            CustomCursor.instance = new CustomCursor(scene);
            CustomCursor.instance.createCursor();
        } else {
            if (CustomCursor.instance.scene !== scene) {
                CustomCursor.instance.scene = scene;
                CustomCursor.instance.recreateCursor();
            }
        }
        return CustomCursor.instance;
    }

    static init(scene) {
        // Load the custom cursor images
        if (!scene.textures.exists('cursor')) {
            scene.load.image('cursor', 'assets/images/ui/cursor.png');
        }
        if (!scene.textures.exists('cursor_clicked')) {
            scene.load.image('cursor_clicked', 'assets/images/ui/cursor_clicked.png');
        }
    }
}
