import { BaseMenu } from './BaseMenu.js';

export default class TableMenu extends BaseMenu {
    constructor(scene, items) {
        const x = scene.sys.game.config.width / 2;
        const y = scene.sys.game.config.height / 2;
        const width = 400;
        const height = 320;
        const backgroundColor = 0x000000;
        const backgroundAlpha = 0.8;
        const borderRadius = 10;

        super(scene, x, y, width, height, backgroundColor, backgroundAlpha, borderRadius);

        this.items = items;
        this.createTableMenu();
    }

    createTableMenu() {
        // Prepare row data for the table
        const rowData = [
            [{ text: 'Item Name' }, { text: 'Price' }] // Header row
        ];

        // Add items as rows in the table
        this.items.forEach(item => {
            rowData.push([{ text: item.name }, { text: `$${item.price.toFixed(2)}` }]);
        });

        // Define column widths
        const columnWidths = [200, 100];

        // Add the table to the menu
        this.addTable(this.x, this.y - 20, this.width - 40, this.height - 110, rowData, columnWidths);

        // Add Close button
        this.addButton(this.x, this.y + this.height / 2 - 30, 80, 30, 'Close', () => this.hide(), null, 0, 0x555555, '#fff', 10);
    }
}
