function mapCoordinatesToAreas(coordinates) {
    // Create a dictionary to hold each area's data
    const areas = {};

    // Populate the areas dictionary with initial data and coordinates
    for (const [area, areaData] of Object.entries(coordinates)) {
        const { x, y, ...rest } = areaData;
        areas[area] = { north: null, south: null, east: null, west: null, ...rest, x, y };
    }

    // Determine neighbors for each area based on coordinates
    for (const [area, areaData] of Object.entries(coordinates)) {
        const { x, y } = areaData;

        // Find neighbors by checking the coordinates
        for (const [neighbor, neighborData] of Object.entries(coordinates)) {
            const { x: nx, y: ny } = neighborData;

            if (x === nx && y === ny + 1) {
                areas[area].south = parseInt(neighbor);
                areas[neighbor].north = parseInt(area);
            } else if (x === nx && y === ny - 1) {
                areas[area].north = parseInt(neighbor);
                areas[neighbor].south = parseInt(area);
            } else if (x === nx - 1 && y === ny) {
                areas[area].east = parseInt(neighbor);
                areas[neighbor].west = parseInt(area);
            } else if (x === nx + 1 && y === ny) {
                areas[area].west = parseInt(neighbor);
                areas[neighbor].east = parseInt(area);
            }
        }
    }

    // Remove the x and y properties from the final output
    Object.values(areas).forEach(area => {
        delete area.x;
        delete area.y;
    });

    return areas;
}

function mapAreasToCoordinates(areas) {
    // Initialize the queue with the starting area, area 1, at coordinates (0, 0)
    const queue = [{ area: 1, x: 0, y: 0 }];
    const visited = new Set();
    const coordinates = {};

    // Valid direction mappings
    const directions = {
        north: { dx: 0, dy: 1 },
        south: { dx: 0, dy: -1 },
        east: { dx: 1, dy: 0 },
        west: { dx: -1, dy: 0 }
    };

    while (queue.length > 0) {
        const current = queue.shift();
        const { area, x, y } = current;

        // If the area is already visited, continue
        if (visited.has(area)) continue;

        // Mark the area as visited and save its coordinates
        visited.add(area);

        // Create a copy of the area's properties and add coordinates
        const areaData = { x, y, ...areas[area] };
        delete areaData.north;
        delete areaData.south;
        delete areaData.east;
        delete areaData.west;

        coordinates[area] = areaData;

        // Explore neighbors, only considering valid directions
        for (const [direction, neighbor] of Object.entries(areas[area])) {
            if (neighbor !== null && directions[direction] && !visited.has(neighbor)) {
                const { dx, dy } = directions[direction];
                queue.push({ area: neighbor, x: x + dx, y: y + dy });
            }
        }
    }

    return coordinates;
}

/**
 * Generates a grid of connected areas within the specified grid size.
 *
 * @param {Array} areaInstances - An array of area instance ids
 * @param {number} [gridSize=10] - The size of the grid (default is 10).
 * @returns {Object} An object representing the grid of areas with their coordinates and types.
 */
function generateGrid(areaInstances, gridSize = 10) {
    const maxAreas = areaInstances.length;

    if (maxAreas < 1 || maxAreas > gridSize * gridSize) {
        throw new Error('Invalid input parameters');
    }

    const directions = [
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 }
    ];

    const areas = {};
    const visited = Array.from({ length: gridSize }, () => Array(gridSize).fill(false));
    let startX, startY;

    function isValid(x, y) {
        const withinBounds = x >= 0 && x < gridSize && y >= 0 && y < gridSize;
        const withinLimit = Math.abs(x - startX) <= 4 && Math.abs(y - startY) <= 4;
        return withinBounds && withinLimit && !visited[x][y];
    }

    function dfs(x, y, count) {
        visited[x][y] = true;
        areas[count] = { x, y, type: 'area', explored: false };

        if (count === maxAreas) return true;

        const shuffledDirections = directions.sort(() => Math.random() - 0.5);
        for (const { dx, dy } of shuffledDirections) {
            const newX = x + dx;
            const newY = y + dy;
            if (isValid(newX, newY) && dfs(newX, newY, count + 1)) {
                return true;
            }
        }

        visited[x][y] = false;
        delete areas[count];
        return false;
    }

    while (true) {
        startX = Math.floor(gridSize / 2);
        startY = Math.floor(gridSize / 2);

        if (dfs(startX, startY, 1)) break;
    }

    // Assign entrance and exit
    const keys = Object.keys(areas);
    areas[keys[0]].type = 'entrance';
    areas[keys[keys.length - 1]].type = 'exit';

    // Replace keys with areaInstanceIds in the areaInstances array
    const mappedAreas = {};
    for (let i = 0; i < keys.length; i++) {
        const areaKey = keys[i];
        const areaInstanceId = areaInstances[i];
        mappedAreas[areaInstanceId] = areas[areaKey];
    }

    return mappedAreas;
}


// Export the functions
module.exports = {
    mapCoordinatesToAreas,
    mapAreasToCoordinates,
    generateGrid
};
