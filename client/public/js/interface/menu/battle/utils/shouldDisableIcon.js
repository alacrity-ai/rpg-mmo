export default function shouldDisableIcon(ability, battlerPosition, battleGrid) {
    const requiredCoords = ability.requiredCoords || [];

    // If the user doesn't have enough mana, disable the icon
    if (ability.cost > battleGrid.scene.battler.currentStats.mana) {
        return true;
    }

    // If a tile is focused, and this ability's targetType is not 'target', disable the icon
    if (battleGrid.tileFocused && ability.targetType !== 'target') {
        return true
    }

    // If a tile is not focused, and this ability's targetType is 'target', disable the icon
    if (!battleGrid.tileFocused && ability.targetType === 'target') {
        return true
    }

    // Check if the selected tile matches the ability's target team
    if (battleGrid.tileFocused) {
        const selectedTileX = battleGrid.selectedTiles[0][0];
        const isFriendlyTile = selectedTileX < 3;
        const isHostileTile = selectedTileX >= 3;

        if ((ability.targetTeam === 'friendly' && !isFriendlyTile) || (ability.targetTeam === 'hostile' && !isHostileTile)) {
            return true;
        }
    }

    // If requiredCoords is empty, enable the icon
    if (requiredCoords.length === 0) {
        return false;
    }

    const isInRequiredCoords = requiredCoords.some(([x, y]) => x === battlerPosition[0] && y === battlerPosition[1]);

    if (isInRequiredCoords) {
        return false;
    } else {
        return true;
    }
}