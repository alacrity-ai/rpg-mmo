import os
import sys
from PIL import Image

def mirror_images_in_directory(folder_path):
    # Check if the folder exists
    if not os.path.isdir(folder_path):
        print(f"The folder {folder_path} does not exist.")
        return

    # Loop through all the files in the folder
    for filename in os.listdir(folder_path):
        if filename.lower().endswith('.png'):
            file_path = os.path.join(folder_path, filename)
            try:
                with Image.open(file_path) as img:
                    mirrored_img = img.transpose(Image.FLIP_LEFT_RIGHT)
                    mirrored_img.save(file_path)
                    print(f"Mirrored and saved {filename}")
            except Exception as e:
                print(f"Failed to process {filename}: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python mirror_images.py <folderpath>")
    else:
        folder_path = sys.argv[1]
        mirror_images_in_directory(folder_path)
