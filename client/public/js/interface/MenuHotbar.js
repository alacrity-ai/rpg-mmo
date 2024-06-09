import SoundFXManager from '../audio/SoundFXManager.js';
import { fadeTransition } from '../scenes/utils/SceneTransitions.js';
import PartyInviteMenu from './menu/PartyInviteMenu.js';

export function createHotbar(scene, iconHelper) {
    // Define a list of icon names to be used in the hotbar with corresponding sound paths
    const icons = [
        { name: 'muscle-icon', sound: 'assets/sounds/menu/menu_highlight.wav' },
        { name: 'book-open', sound: 'assets/sounds/menu/book_open.wav' },
        { name: 'backpack', sound: 'assets/sounds/menu/bag_open.wav' },
        { name: 'speech-bubbles', sound: 'assets/sounds/menu/chat_menu.wav' },
        { name: 'map', sound: 'assets/sounds/menu/book_open.wav', sceneKey: 'WorldmapScene' } // Added sceneKey for map icon
    ];

    const hoverSound = 'assets/sounds/menu/highlight.wav';
    let partyInviteMenu; // Declare partyInviteMenu variable

    // Create hotbar buttons with icons
    icons.forEach((icon, index) => {
        let iconContainer = iconHelper.getIcon(icon.name); // Get icon container by name
        iconContainer.setPosition(75 + index * 50, 530);
        iconContainer.setDepth(1);

        // Set up interactivity on the container
        iconContainer.setInteractive();
        iconContainer.on('pointerdown', () => {
            SoundFXManager.playSound(icon.sound); // Play the associated sound effect

            // Check if the icon has a sceneKey and start the scene if it does
            if (icon.sceneKey) {
                fadeTransition(scene, icon.sceneKey);
            }

            // Check if the 'speech-bubbles' icon is clicked
            if (icon.name === 'speech-bubbles') {
                // If partyInviteMenu already exists, just show it
                if (partyInviteMenu) {
                    partyInviteMenu.show();
                } else {
                    // Instantiate PartyInviteMenu
                    partyInviteMenu = new PartyInviteMenu(scene);
                    // scene.add.existing(partyInviteMenu);
                }
            }

            // Implement additional submenu logic here
        });

        iconContainer.on('pointerover', () => {
            SoundFXManager.playSound(hoverSound); // Play the hover sound effect
            scene.tweens.add({
                targets: iconContainer,
                scale: 1.2,
                duration: 200,
                ease: 'Power2'
            });
        });

        iconContainer.on('pointerout', () => {
            scene.tweens.add({
                targets: iconContainer,
                scale: 1,
                duration: 200,
                ease: 'Power2'
            });
        });

        scene.add.existing(iconContainer); // Add the icon container to the scene
    });
}
