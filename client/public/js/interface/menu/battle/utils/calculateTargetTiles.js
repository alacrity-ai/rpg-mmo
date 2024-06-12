export default function calculateTargetTiles(ability, battleGrid, battlerId) {
    const targetTiles = [];

    if (ability.targetType === 'self') {
        const position = battleGrid.getBattlerPosition(battlerId);
        targetTiles.push(position);
    } else if (ability.targetType === 'area') {
        if (ability.targetTeam === 'friendly') {
            targetTiles.push(...ability.targetArea);
        } else if (ability.targetTeam === 'hostile') {
            ability.targetArea.forEach(([x, y]) => {
                targetTiles.push([x + 3, y]);
            });
        }
    } else if (ability.targetType === 'relative') {
        const battlerPosition = battleGrid.getBattlerPosition(battlerId);
        const [battlerX, battlerY] = battlerPosition;
        ability.targetArea.forEach(([x, y]) => {
            if (battlerX + x < 3) {
                targetTiles.push([battlerX + x, battlerY + y, true])
            } else {
                targetTiles.push([battlerX + x, battlerY + y, false]);
            }    
        });
    } else if (ability.targetType === 'target') {
        if (battleGrid.tileFocused) {
            targetTiles.push(battleGrid.selectedTiles[0]);
        }
    }

    // Filter out any tiles that are out of bounds (x > 5 or y > 2 or x < 0 or y < 0)
    return targetTiles.filter(([x, y]) => x >= 0 && x < 6 && y >= 0 && y < 3);
}
