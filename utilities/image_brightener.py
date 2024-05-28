from PIL import Image, ImageEnhance
import argparse

def enhance_fog_image(input_path, output_path, thickness_factor=2.0, transparency_reduction=0.5):
    # Open the image
    img = Image.open(input_path).convert("RGBA")
    
    # Split into individual bands
    r, g, b, a = img.split()
    
    # Convert to numpy array for pixel-wise manipulation
    a_data = a.load()
    r_data = r.load()
    g_data = g.load()
    b_data = b.load()
    
    # Adjust transparency for black and white pixels
    for y in range(img.height):
        for x in range(img.width):
            # Calculate the intensity of the pixel
            intensity = (r_data[x, y] + g_data[x, y] + b_data[x, y]) / 3
            if intensity > 200:  # Light pixels (white)
                a_data[x, y] = int(min(255, a_data[x, y] * thickness_factor))
            elif intensity < 55:  # Dark pixels (black)
                a_data[x, y] = int(a_data[x, y] * transparency_reduction)
    
    # Merge back the bands
    enhanced_img = Image.merge("RGBA", (r, g, b, a))
    
    # Save the enhanced image
    enhanced_img.save(output_path)
    print(f"Enhanced image saved to {output_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Enhance the thickness and reduce the transparency of a fog image")
    parser.add_argument("input_path", help="Path to the input PNG image")
    parser.add_argument("output_path", help="Path to save the enhanced PNG image")
    parser.add_argument("--thickness_factor", type=float, default=2.0, help="Factor to increase the thickness of the fog (default: 2.0)")
    parser.add_argument("--transparency_reduction", type=float, default=0.5, help="Factor to reduce the transparency of darker pixels (default: 0.5)")
    
    args = parser.parse_args()
    
    enhance_fog_image(args.input_path, args.output_path, args.thickness_factor, args.transparency_reduction)
