from PIL import Image
import os
import sys

def rotate_image(input_image_path, output_image_path, degrees=45):
    try:
        # Open the input image
        image = Image.open(input_image_path)

        # Rotate the image by the given degrees
        rotated_image = image.rotate(degrees, expand=True)

        # Change the output extension to .png if input is .webp
        if input_image_path.lower().endswith('.webp'):
            output_image_path = os.path.splitext(output_image_path)[0] + '.png'

        # Save the rotated image to the specified output path
        rotated_image.save(output_image_path)
        
        print(f"Image rotated by {degrees} degrees and saved to {output_image_path}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    if len(sys.argv) not in [3, 4]:
        print("Usage: python rotate_image.py <input_image_path> <output_image_path> [degrees]")
    else:
        input_image_path = sys.argv[1]
        output_image_path = sys.argv[2]
        degrees = float(sys.argv[3]) if len(sys.argv) == 4 else 45
        rotate_image(input_image_path, output_image_path, degrees)
