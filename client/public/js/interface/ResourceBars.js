export default class ResourceBars {
    constructor(scene, x, y, maxHealth, maxMana) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.barWidth = 5;
        this.barHeight = 70;
        this.maxHealth = maxHealth;
        this.maxMana = maxMana;
        this.currentHealth = maxHealth;
        this.currentMana = maxMana;
        this.spacing = 5; // Spacing between the bars

        this.createBars();
    }

    createBars() {
        // Create the background for the health bar
        this.healthBackground = this.scene.add.graphics();
        this.createBackground(this.healthBackground, this.x, this.y);

        // Create the health bar
        this.healthBar = this.scene.add.graphics();
        this.updateHealthBar();

        // Create the background for the mana bar
        this.manaBackground = this.scene.add.graphics();
        this.createBackground(this.manaBackground, this.x + this.barWidth + this.spacing, this.y);

        // Create the mana bar
        this.manaBar = this.scene.add.graphics();
        this.updateManaBar();

        // Create the border for the health bar
        this.healthBorder = this.scene.add.graphics();
        this.createBorder(this.healthBorder, this.x, this.y);

        // Create the border for the mana bar
        this.manaBorder = this.scene.add.graphics();
        this.createBorder(this.manaBorder, this.x + this.barWidth + this.spacing, this.y);
    }

    createBackground(graphics, x, y) {
        graphics.fillStyle(0x000000, 0.5); // Semi-transparent black background
        graphics.fillRect(x - 1, y - 1, this.barWidth + 2, this.barHeight + 2); // Add 1px border around the bars
    }

    createBorder(graphics, x, y) {
        const radius = 5; // Adjust the radius for less rounded corners
        graphics.lineStyle(2, 0xffffff, 1);
        graphics.strokeRoundedRect(x - 1, y - 1, this.barWidth + 2, this.barHeight + 2, radius);
    }

    updateHealthBar() {
        this.healthBar.clear();
        this.healthBar.fillStyle(0xff0000, 1); // Red color for health
        const healthHeight = (this.currentHealth / this.maxHealth) * this.barHeight;
        this.healthBar.fillRect(this.x, this.y + this.barHeight - healthHeight, this.barWidth, healthHeight);
    }

    updateManaBar() {
        this.manaBar.clear();
        this.manaBar.fillStyle(0x0000ff, 1); // Blue color for mana
        const manaHeight = (this.currentMana / this.maxMana) * this.barHeight;
        this.manaBar.fillRect(this.x + this.barWidth + this.spacing, this.y + this.barHeight - manaHeight, this.barWidth, manaHeight);
    }

    setHealth(value) {
        this.currentHealth = Phaser.Math.Clamp(value, 0, this.maxHealth);
        this.updateHealthBar();
    }

    setMana(value) {
        this.currentMana = Phaser.Math.Clamp(value, 0, this.maxMana);
        this.updateManaBar();
    }

    adjustHealth(amount) {
        this.setHealth(this.currentHealth + amount);
    }

    adjustMana(amount) {
        this.setMana(this.currentMana + amount);
    }
}
