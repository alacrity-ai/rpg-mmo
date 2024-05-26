import os
import sys
from PIL import Image

def convert_webp_to_png(image_path, output_path):
    # Open the image
    image = Image.open(image_path).convert("RGBA")
    
    # Save the image as PNG
    image.save(output_path)

def process_webp_images_in_folder(folder_path):
    # Get all webp files in the folder
    image_files = [f for f in os.listdir(folder_path) if f.endswith('.webp')]

    # Process each webp file
    for i, image_file in enumerate(image_files):
        image_path = os.path.join(folder_path, image_file)
        output_path = os.path.join(folder_path, f'sprite_{i+1}.png')
        convert_webp_to_png(image_path, output_path)
        print(f"Converted {image_file} -> {output_path}")
        os.remove(image_path)
        print(f"Removed original file {image_file}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script.py <image_folder_path>")
        sys.exit(1)

    image_folder_path = sys.argv[1]
    process_webp_images_in_folder(image_folder_path)
