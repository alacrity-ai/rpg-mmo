import { BaseMenu } from '../BaseMenu.js';

export default class StatsMenu extends BaseMenu {
    constructor(scene, currentHealth, maxHealth, currentMana, maxMana) {
        const x = scene.sys.game.config.width / 2;
        const y = scene.sys.game.config.height / 2 + 180;
        const width = 300;
        const height = 64;
        const hasCloseButton = false;
        const backgroundColor = 0x000000;
        const backgroundAlpha = 0.8;
        const borderRadius = 10;
        const hasWindowBorder = false;

        // Instantiate menu with the specified parameters
        super(scene, x, y, width, height, backgroundColor, backgroundAlpha, borderRadius, null, null, hasCloseButton, true, hasWindowBorder);

        this.currentHealth = currentHealth;
        this.maxHealth = maxHealth;
        this.currentMana = currentMana;
        this.maxMana = maxMana;

        this.createStatsBars();
    }

    createStatsBars() {
        // 0xff0000 is red, 0x0000ff is blue
        // Add health bar
        const healthBarY = this.y - this.height / 4;
        this.healthBar = this.addStatBar(this.x, healthBarY, this.width - 40, 20, 0xff0000, 'Health');
        this.updateStatBar(this.healthBar, this.currentHealth, this.maxHealth);

        // Add mana bar
        const manaBarY = this.y + this.height / 4;
        this.manaBar = this.addStatBar(this.x, manaBarY, this.width - 40, 20, 0x0000ff, 'Mana');
        this.updateStatBar(this.manaBar, this.currentMana, this.maxMana);
    }

    updateHealth(currentHealth, maxHealth) {
        this.currentHealth = currentHealth;
        this.maxHealth = maxHealth;
        this.updateStatBar(this.healthBar, this.currentHealth, this.maxHealth);
    }

    updateMana(currentMana, maxMana) {
        this.currentMana = currentMana;
        this.maxMana = maxMana;
        this.updateStatBar(this.manaBar, this.currentMana, this.maxMana);
    }
}
