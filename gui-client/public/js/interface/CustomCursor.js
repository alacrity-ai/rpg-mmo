export default class CustomCursor {
    constructor(scene) {
        this.scene = scene;

        // Load the custom cursor images
        this.scene.load.image('cursor', 'assets/images/ui/cursor.png');
        this.scene.load.image('cursor_clicked', 'assets/images/ui/cursor_clicked.png');

        // Wait for the preload method to complete
        this.scene.load.once('complete', this.createCursor, this.scene);
    }

    createCursor() {
        // Hide the default cursor
        this.input.setDefaultCursor('none');

        // Add custom cursors
        this.customCursor = this.add.image(this.input.activePointer.x, this.input.activePointer.y, 'cursor').setDepth(1000).setOrigin(0, 0);
        this.cursorClicked = this.add.image(this.input.activePointer.x, this.input.activePointer.y, 'cursor_clicked').setDepth(1000).setOrigin(0, 0).setVisible(false);

        // Update cursor position on pointer move
        this.input.on('pointermove', pointer => {
            this.customCursor.setPosition(pointer.x, pointer.y);
            this.cursorClicked.setPosition(pointer.x, pointer.y);
        });

        // Change cursor image on pointer down and up
        this.input.on('pointerdown', () => {
            this.customCursor.setVisible(false);
            this.cursorClicked.setVisible(true);
        });

        this.input.on('pointerup', () => {
            this.customCursor.setVisible(true);
            this.cursorClicked.setVisible(false);
        });
    }

    update() {
        // Update custom cursor position to follow the pointer
        if (this.customCursor && this.cursorClicked) {
            this.customCursor.setPosition(this.scene.input.activePointer.x, this.scene.input.activePointer.y);
            this.cursorClicked.setPosition(this.scene.input.activePointer.x, this.scene.input.activePointer.y);
        }
    }
}
