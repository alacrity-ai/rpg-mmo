export default class TextBox {
    constructor(scene, x, y, prompt, onEnter) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.prompt = prompt;
        this.onEnter = onEnter;
        this.playerName = '';
        this.createTextBox();
    }

    createTextBox() {
        const style = { font: '32px Arial', fill: '#ffffff' };
        this.promptText = this.scene.add.text(this.x, this.y, this.prompt, style).setOrigin(0.5);
        this.inputText = this.scene.add.text(this.x, this.y + 50, '', style).setOrigin(0.5);

        this.scene.input.keyboard.on('keydown', (event) => {
            if (event.key === 'Backspace' && this.playerName.length > 0) {
                this.playerName = this.playerName.substring(0, this.playerName.length - 1);
            } else if (event.key.length === 1 && event.key.match(/^[a-zA-Z0-9]$/)) {
                this.playerName += event.key;
            } else if (event.key === 'Enter' && this.playerName.length > 0) {
                this.promptText.destroy();
                this.inputText.destroy();
                this.onEnter(this.playerName);
            }

            this.inputText.setText(this.playerName);
        }, this);
    }
}
