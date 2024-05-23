/**
 * Generates a grid of connected rooms within the specified grid size.
 *
 * @param {number} minRooms - The minimum number of rooms.
 * @param {number} maxRooms - The maximum number of rooms.
 * @param {number} [gridSize=10] - The size of the grid (default is 10).
 * @returns {Object} An object representing the grid of rooms with their coordinates and types.
 */
function generateGrid(minRooms, maxRooms, gridSize = 10) {
    if (minRooms < 1 || maxRooms > gridSize * gridSize || minRooms > maxRooms) {
        throw new Error('Invalid input parameters');
    }

    const numRooms = Math.floor(Math.random() * (maxRooms - minRooms + 1)) + minRooms;

    const directions = [
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 }
    ];

    const rooms = {};
    const visited = Array.from({ length: gridSize }, () => Array(gridSize).fill(false));
    let startX, startY;

    function isValid(x, y) {
        const withinBounds = x >= 0 && x < gridSize && y >= 0 && y < gridSize;
        const withinLimit = Math.abs(x - startX) <= 4 && Math.abs(y - startY) <= 4;
        return withinBounds && withinLimit && !visited[x][y];
    }

    function dfs(x, y, count) {
        visited[x][y] = true;
        rooms[count] = { x, y, type: 'area' };

        if (count === numRooms) return true;

        const shuffledDirections = directions.sort(() => Math.random() - 0.5);
        for (const { dx, dy } of shuffledDirections) {
            const newX = x + dx;
            const newY = y + dy;
            if (isValid(newX, newY) && dfs(newX, newY, count + 1)) {
                return true;
            }
        }

        visited[x][y] = false;
        delete rooms[count];
        return false;
    }

    while (true) {
        startX = Math.floor(gridSize / 2);
        startY = Math.floor(gridSize / 2);

        if (dfs(startX, startY, 1)) break;
    }

    // Assign entrance and exit
    const keys = Object.keys(rooms);
    rooms[keys[0]].type = 'entrance';
    rooms[keys[keys.length - 1]].type = 'exit';

    return rooms;
}

// Example usage:
const minRooms = 12;
const maxRooms = 18;
const gridSize = 10;

const generatedGrid = generateGrid(minRooms, maxRooms, gridSize);
console.log(generatedGrid);


const { mapCoordinatesToAreas, mapAreasToCoordinates } = require('./mapFunctions');
console.log(mapCoordinatesToAreas(generatedGrid));