class Tile {
    constructor(scene, x, y, textureKey, isPlayerSide) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.baseTextureKey = textureKey;
        this.isPlayerSide = isPlayerSide;
        this.battlers = [];
        this.telegraphCount = 0;
        this.selected = false;
        this.hovered = false; // Added this
        this.tween = null;

        this.sprite = this.scene.add.sprite(x, y, textureKey);
        this.sprite.setOrigin(0, 0);
    }

    addBattler(battlerId) {
        if (!this.battlers.includes(battlerId)) {
            this.battlers.push(battlerId);
            this.updateTexture(); // Update the texture when a battler is added
        }
    }

    removeBattler(battlerId) {
        const index = this.battlers.indexOf(battlerId);
        if (index > -1) {
            this.battlers.splice(index, 1);
            this.updateTexture(); // Update the texture when a battler is removed
        }
    }

    // Add this method
    getBattlerIds() {
        return this.battlers;
    }

    updateTexture(inactive = false) {
        let newTextureKey = this.baseTextureKey;

        if (this.telegraphCount > 0) {
            newTextureKey = 'telegraph';
        }

        if (this.selected) {
            if (this.telegraphCount > 0) {
                newTextureKey = this.isPlayerSide ? 'telegraph_selected_gold' : 'telegraph_selected_red';
            } else {
                if (inactive) {
                    newTextureKey = this.isPlayerSide ? 'selected_inactive' : 'selected_inactive';
                } else {
                    newTextureKey = this.isPlayerSide ? 'selected_green' : 'selected_red';
                }
            }
        } else if (this.telegraphCount === 0) {
            if (this.hovered) {
                newTextureKey = this.isPlayerSide ? 'hovered_green' : 'hovered_red';
            } else {
                newTextureKey = this.isPlayerSide 
                    ? (this.battlers.length > 0 ? 'occupied_green' : 'unoccupied_green') 
                    : (this.battlers.length > 0 ? 'occupied_red' : 'unoccupied_red');
            }
        }

        this.sprite.setTexture(newTextureKey);
        this.sprite.setAlpha(1); // Reset the alpha if not telegraphed or selected

        // Remove the tween if it exists
        if (this.tween) {
            this.tween.stop();
            this.tween = null;
        }

        // If the tile is selected or telegraphed, create the tween
        if (this.selected || this.telegraphCount > 0 || this.hovered) {
            this.tween = this.scene.tweens.add({
                targets: this.sprite,
                alpha: { start: 1, to: 0.7 },
                duration: 500,
                yoyo: true,
                repeat: -1
            });
        }
    }

    select(inactive = false) {
        this.selected = true;
        this.updateTexture(inactive);
    }

    deselect() {
        this.selected = false;
        this.updateTexture();
    }

    showTelegraph() {
        this.telegraphCount += 1;
        this.updateTexture();

        // Create the tween for the telegraphed tile if not already created
        if (!this.tween) {
            this.tween = this.scene.tweens.add({
                targets: this.sprite,
                alpha: { start: 1, to: 0.7 },
                duration: 500,
                yoyo: true,
                repeat: -1
            });
        }
    }

    hideTelegraph() {
        this.telegraphCount -= 1;
        this.updateTexture();
    }
}

export default Tile;
