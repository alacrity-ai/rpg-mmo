// utils/drawBox.js

export function drawBox(x1, y1, x2, y2, targetDiv) {
    // Create the box element
    const box = document.createElement('div');
    box.style.position = 'absolute';
    box.style.left = `${x1}px`;
    box.style.top = `${y1}px`;
    box.style.width = `${x2 - x1}px`;
    box.style.height = `${y2 - y1}px`;
    box.style.border = '2px solid #FF0000'; // Red border
    box.style.boxSizing = 'border-box'; // Include border in size
    box.style.zIndex = 5; // Ensure the box is above other elements
    box.style.cursor = 'pointer'; // Set cursor to pointer

    targetDiv.appendChild(box);

    return box; // Return the box element so we can attach event listeners
}
