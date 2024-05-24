export default class CustomCursor {
    constructor(scene) {
        if (CustomCursor.instance) {
            return CustomCursor.instance;
        }

        this.scene = scene;
        this.createCursor();

        CustomCursor.instance = this;
    }

    createCursor() {
        // Hide the default cursor
        this.scene.input.setDefaultCursor('none');

        // Add custom cursors
        this.customCursor = this.scene.add.image(this.scene.input.activePointer.x, this.scene.input.activePointer.y, 'cursor').setDepth(1000).setOrigin(0, 0);
        this.cursorClicked = this.scene.add.image(this.scene.input.activePointer.x, this.scene.input.activePointer.y, 'cursor_clicked').setDepth(1000).setOrigin(0, 0).setVisible(false);

        // Update cursor position on pointer move
        this.scene.input.on('pointermove', pointer => {
            this.customCursor.setPosition(pointer.x, pointer.y);
            this.cursorClicked.setPosition(pointer.x, pointer.y);
        });

        // Change cursor image on pointer down and up
        this.scene.input.on('pointerdown', () => {
            this.customCursor.setVisible(false);
            this.cursorClicked.setVisible(true);
        });

        this.scene.input.on('pointerup', () => {
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

    static getInstance(scene) {
        if (!CustomCursor.instance) {
            CustomCursor.instance = new CustomCursor(scene);
        } else {
            CustomCursor.instance.scene = scene;
        }
        return CustomCursor.instance;
    }

    static init(scene) {
        // Load the custom cursor images
        scene.load.image('cursor', 'assets/images/ui/cursor.png');
        scene.load.image('cursor_clicked', 'assets/images/ui/cursor_clicked.png');
    }
}
