export function createHotbar(scene, iconHelper, soundFXManager) {
    // Define a list of icon names to be used in the hotbar with corresponding sound paths
    const icons = [
        { name: 'muscle-icon', sound: 'assets/sounds/menu/menu_highlight.wav' },
        { name: 'book-open', sound: 'assets/sounds/menu/book_open.wav' },
        { name: 'backpack', sound: 'assets/sounds/menu/bag_open.wav' },
        { name: 'speech-bubbles', sound: 'assets/sounds/menu/chat_menu.wav' },
        { name: 'tent', sound: 'assets/sounds/menu/tent_open.wav' }
    ];

    const hoverSound = 'assets/sounds/menu/highlight.wav';

    // Create hotbar buttons with icons
    icons.forEach((icon, index) => {
        let iconContainer = iconHelper.getIcon(icon.name); // Get icon container by name
        iconContainer.setPosition(75 + index * 50, 550);

        // Set up interactivity on the container
        iconContainer.setInteractive();
        iconContainer.on('pointerdown', () => {
            console.log(`Icon ${icon.name} clicked`);
            soundFXManager.playSound(icon.sound); // Play the associated sound effect
            // Implement submenu logic here
        });

        iconContainer.on('pointerover', () => {
            console.log(`Icon ${icon.name} hovered`);
            soundFXManager.playSound(hoverSound); // Play the hover sound effect
            scene.tweens.add({
                targets: iconContainer,
                scale: 1.2,
                duration: 200,
                ease: 'Power2'
            });
        });

        iconContainer.on('pointerout', () => {
            console.log(`Icon ${icon.name} unhovered`);
            scene.tweens.add({
                targets: iconContainer,
                scale: 1,
                duration: 200,
                ease: 'Power2'
            });
        });

        console.log(`Adding icon: ${icon.name}`); // Debugging info
        scene.add.existing(iconContainer); // Add the icon container to the scene
    });
}
