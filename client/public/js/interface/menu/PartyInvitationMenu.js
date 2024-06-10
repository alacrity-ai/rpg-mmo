import { BaseMenu } from './BaseMenu.js';
import ErrorMenu from './ErrorMenu.js';
import api from '../../api';

export default class PartyInvitationMenu extends BaseMenu {
    constructor(scene, inviterName, partyId, width = 400, height = 200) {
        const x = scene.sys.game.config.width / 2;
        const y = scene.sys.game.config.height / 2;
        const backgroundColor = 0x000000;
        const backgroundAlpha = 0.8;
        const borderRadius = 10;

        super(scene, x, y, width, height, backgroundColor, backgroundAlpha, borderRadius);

        this.inviterName = inviterName;
        this.partyId = partyId;
        this.createInvitationMenu();
    }

    createInvitationMenu() {
        // Add text area
        const textY = this.y - this.height / 2 + 20;
        const invitationMessage = `${this.inviterName} has invited you to join a Party!`;
        this.addTextArea(this.x - this.width / 2 + 20, textY, this.width - 40, this.height / 4, invitationMessage, { fontSize: '16px', fill: '#fff' });

        // Add buttons
        const buttonY = this.y + this.height / 2 - 40;
        const buttonSpacing = 110; // Adjust spacing between buttons
        this.addButton(this.x - buttonSpacing / 2, buttonY, 100, 40, 'Accept', () => this.handleAccept(), null, 0, 0x006600);
        this.addButton(this.x + buttonSpacing / 2, buttonY, 100, 40, 'Reject', () => this.handleReject());
    }

    async handleAccept() {
        api.party.respondToPartyInvite(this.partyId, true)
            .then(response => {
                console.log('Accepted party invite: ', response);
                this.hide();
            })
            .catch(error => {
                console.error('Error accepting party invite:', error);
                this.showError(`${error}`);
            });
    }

    handleReject() {
        api.party.respondToPartyInvite(this.partyId, false)
            .then(response => {
                console.log('Rejected party invite: ', response);
                // delete this.scene.partyInvitationMenu);
                this.hide();
                // completely delete the instance by entirely removing it from the scene
                this.destroy();
                this.scene.partyInvitationMenu = null;
            })
            .catch(error => {
                console.error('Error rejecting party invite:', error);
                this.showError(`${error}`);
            });
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
