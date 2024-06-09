import { BaseMenu } from './BaseMenu.js';
import ErrorMenu from './ErrorMenu.js';
import api from '../../api';

export default class PartyInviteMenu extends BaseMenu {
    constructor(scene, width = 400, height = 200) {
        const x = scene.sys.game.config.width / 2;
        const y = scene.sys.game.config.height / 2;
        const backgroundColor = 0x000000;
        const backgroundAlpha = 0.8;
        const borderRadius = 10;

        super(scene, x, y, width, height, backgroundColor, backgroundAlpha, borderRadius);

        this.createInviteMenu();
    }

    createInviteMenu() {
        // Add text area
        const textY = this.y - this.height / 2 + 20;
        this.addTextArea(this.x - this.width / 2 + 20, textY, this.width - 40, this.height / 4, "Invite a character by name", { fontSize: '16px', fill: '#fff' });

        // Add name input
        const inputY = textY + this.height / 4 + 10;
        this.nameInput = this.addTextInput(this.x, inputY, this.width - 40, 40, "Name", 0, 16, false, true);

        // Add buttons
        const buttonY = this.y + this.height / 2 - 40;
        const buttonSpacing = 110; // Adjust spacing between buttons
        this.addButton(this.x - buttonSpacing / 2, buttonY, 100, 40, 'Invite', () => this.handleInvite(), null, 0, 0x006600);
        this.addButton(this.x + buttonSpacing / 2, buttonY, 100, 40, 'Cancel', () => this.handleCancel());
    }

    async handleInvite() {
        const invitedCharacterName = this.getTextInputValue(0, 0).toLowerCase();
    
        api.party.inviteToParty(invitedCharacterName)
            .then(response => {
                console.log('Got response: ', response);
                console.log('Invited character:', response.character);
                this.hide();
            })
            .catch(error => {
                this.showError(`${error}`);
            });
    }

    handleCancel() {
        this.hide();
    }

    showError(message) {
        // Implement error displaying logic, e.g., showing a temporary error message on the menu
        const errorMenu = new ErrorMenu(this.scene, message);
        errorMenu.onClose = () => {
            this.show();
        };
        this.hideNoOnclose();
        errorMenu.show();
    }
}
