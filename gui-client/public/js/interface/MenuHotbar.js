// js/interface/MenuHotbar.js
export function createHotbar(scene, iconHelper) {
    // Define a list of icon names to be used in the hotbar
    const iconNames = ['skull', 'chat', 'sparkles', 'heart', 'smiley'];

    // Create hotbar buttons with icons
    iconNames.forEach((iconName, index) => {
        let icon = iconHelper.getIcon(iconName); // Get icon by name
        icon.setPosition(100 + index * 100, 550);
        icon.setInteractive();

        icon.on('pointerdown', () => {
            console.log(`Icon ${iconName} clicked`);
            // Implement submenu logic here
        });

        scene.add.existing(icon); // Add the icon to the scene
    });
}
