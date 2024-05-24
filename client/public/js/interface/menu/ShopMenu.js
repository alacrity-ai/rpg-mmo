import { BaseMenu } from './BaseMenu.js';
import PopupTooltipMenu from './PopupTooltipMenu.js';

export default class ShopMenu extends BaseMenu {
    constructor(scene, items) {
        const x = scene.sys.game.config.width / 2 - 40;
        const y = scene.sys.game.config.height / 2;
        const width = 400;
        const height = 440;
        const hasCloseButton = true;
        const backgroundColor = 0x000000;
        const backgroundAlpha = 0.8;
        const borderRadius = 10;

        // Define the onClose callback function
        const onCloseCallback = () => {
            console.log('Running on close callback')
            if (this.tooltipMenu) {
                console.log('Destroying tooltip menu')
                this.tooltipMenu.destroy();
                this.tooltipMenu = null;
            }
        };

        // Instantiate menu with the specified parameters and onClose callback
        super(scene, x, y, width, height, backgroundColor, backgroundAlpha, borderRadius, 'icons', onCloseCallback, hasCloseButton);

        this.items = items;
        this.tooltipMenu = null; // Initialize the tooltip menu
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

        // Add the table to the menu with the onRowSelected callback
        this.addTable(this.x, this.y - 10, this.width - 40, this.height - 150, rowData, columnWidths, 0, (selectedRowIndex) => {
            this.renderTooltip(selectedRowIndex);
        });

        // Add Buy button
        this.addButton(this.x, this.y + this.height / 2 - 30, 80, 30, 'Buy', () => this.purchaseItem(), null, 0, 0x555555, '#fff', 10);

        // Add gold-coins icon and TextArea
        this.addIcon(this.x - this.width / 2 + 30, this.y - this.height / 2 + 30, 'gold-coins', 'Your Gold');
        this.addTextArea(this.x - this.width / 2 + 60, this.y - this.height / 2 + 30, 100, 30, '$100.00', { fontSize: '16px', fill: '#fff' });
    }

    purchaseItem() {
        const selectedRow = this.getSelectedRow();
        if (selectedRow) {
            const itemName = selectedRow[0].text;
            const itemPrice = selectedRow[1].text;
            console.log(`Purchased item: ${itemName} for ${itemPrice}`);
        } else {
            console.log("No item selected");
        }
    }

    renderTooltip(selectedRowIndex) {
        const tooltipX = this.x + 320;
        const tooltipY = this.y;

        if (selectedRowIndex !== null && selectedRowIndex > 0) {
            const selectedItem = this.items[selectedRowIndex - 1]; // Adjusted index for actual item data
            if (this.tooltipMenu) {
                this.tooltipMenu.destroy();
            }
            this.tooltipMenu = new PopupTooltipMenu(
                this.scene,
                tooltipX,
                tooltipY,
                selectedItem.icon,
                selectedItem.name,
                selectedItem.description
            );
            this.tooltipMenu.show();
        } else if (this.tooltipMenu) {
            this.tooltipMenu.destroy();
            this.tooltipMenu = null;
        }
    }
}
