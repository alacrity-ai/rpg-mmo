import os
import sys
import subprocess
from PIL import Image

def optimize_png(image_path):
    try:
        # Optimize the image using optipng
        subprocess.run(['optipng', '-o2', image_path], check=True)
        print(f"Optimized {image_path}")
    except Exception as e:
        print(f"Error optimizing {image_path}: {e}")

def process_png_images_in_folder(folder_path):
    # Get all png files in the folder
    image_files = [f for f in os.listdir(folder_path) if f.endswith('.png')]

    # Process each png file
    for image_file in image_files:
        image_path = os.path.join(folder_path, image_file)
        optimize_png(image_path)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python optimize_pngs.py <folder_path>")
        sys.exit(1)

    folder_path = sys.argv[1]
    if not os.path.isdir(folder_path):
        print(f"The provided folder path {folder_path} is not valid.")
        sys.exit(1)

    process_png_images_in_folder(folder_path)
