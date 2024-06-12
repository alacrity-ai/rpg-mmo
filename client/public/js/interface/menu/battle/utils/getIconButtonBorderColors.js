export default function getIconButtonBorderColors(targetTeam, targetType) {
    let normalBorderColor = 0xffffff; // Default white color
    let hoverBorderColor = 0xffff00; // Default yellow color

    if (targetType === 'self') {
        normalBorderColor = 0xadd8e6; // Light blue
    } else if (targetType === 'area') {
        if (targetTeam === 'hostile') {
            normalBorderColor = 0x800080; // Purple
        } else if (targetTeam === 'friendly') {
            normalBorderColor = 0x00ff00; // Green
        }
    } else if (targetType === 'relative') {
        if (targetTeam === 'hostile') {
            normalBorderColor = 0xff0000; // Red
        } else if (targetTeam === 'friendly') {
            normalBorderColor = 0x00ff00; // Green
        }
    } else if (targetType === 'target') {
        if (targetTeam === 'hostile') {
            normalBorderColor = 0xffa500; // Orange
        } else if (targetTeam === 'friendly') {
            normalBorderColor = 0x32cd32; // Lime green
        }
    }

    return { normalBorderColor, hoverBorderColor };
}
