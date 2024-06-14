export function getFilterForColor(color) {
    const rgb = hexToRgb(color);
    return `brightness(0) saturate(100%) invert(${rgb.r / 255}) sepia(${rgb.g / 255}) saturate(${rgb.b / 255})`;
}
  
export function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
      hex = hex.split('').map((h) => h + h).join('');
    }
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}