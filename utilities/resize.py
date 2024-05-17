import os
from PIL import Image

def resize_image(image_path):
    with Image.open(image_path) as img:
        new_size = (img.width // 2, img.height // 2)
        resized_img = img.resize(new_size, Image.ANTIALIAS)
        resized_img.save(image_path)
        print(f"Resized {image_path} to {new_size}")

def resize_images_in_folder(folder_path):
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.lower().endswith('.png'):
                file_path = os.path.join(root, file)
                resize_image(file_path)

if __name__ == "__main__":
    input_folder = input("Enter the path to the folder: ")
    if os.path.isdir(input_folder):
        resize_images_in_folder(input_folder)
        print("All .png images have been resized.")
    else:
        print("Invalid folder path.")
