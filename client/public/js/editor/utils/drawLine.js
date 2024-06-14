// ./utils/drawLine.js

export function drawLine(x1, y1, x2, y2, targetDiv) {
    // Create a canvas element or get existing one
    let canvas = targetDiv.querySelector('canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.width = targetDiv.offsetWidth;
        canvas.height = targetDiv.offsetHeight;
        canvas.style.position = 'absolute';
        canvas.style.top = 0;
        canvas.style.left = 0;
        canvas.style.zIndex = 0; // Ensure canvas is below node elements
        targetDiv.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');

    // Draw the line
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = '#000'; // You can customize the color
    ctx.lineWidth = 2; // You can customize the line width
    ctx.stroke();
}
