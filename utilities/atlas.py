import os
import json
from PIL import Image

MAX_IMAGES_PER_ROW = 8
MAX_ATLAS_WIDTH = 4096

def create_texture_atlas_in_folder(folder_path):
    # Collect all .png files in the folder, ignoring atlas.png
    images = []
    for file in os.listdir(folder_path):
        if file.lower().endswith('.png') and file.lower() != 'atlas.png':
            file_path = os.path.join(folder_path, file)
            images.append((file, Image.open(file_path)))
    
    if not images:
        print(f"No .png files found in {folder_path}")
        return
    
    # Determine the size of the atlas
    num_images = len(images)
    rows = (num_images + MAX_IMAGES_PER_ROW - 1) // MAX_IMAGES_PER_ROW
    row_width = min(MAX_ATLAS_WIDTH, sum(image.size[0] for _, image in images[:MAX_IMAGES_PER_ROW]))
    atlas_width = row_width
    atlas_height = sum(max(image.size[1] for _, image in images[row * MAX_IMAGES_PER_ROW:(row + 1) * MAX_IMAGES_PER_ROW])
                       for row in range(rows))
    
    # Create the atlas image
    atlas = Image.new('RGBA', (atlas_width, atlas_height))
    x_offset = 0
    y_offset = 0
    row_height = 0
    frames = {}
    
    for idx, (filename, image) in enumerate(images):
        if idx % MAX_IMAGES_PER_ROW == 0 and idx != 0:
            x_offset = 0
            y_offset += row_height
            row_height = 0
        
        atlas.paste(image, (x_offset, y_offset))
        frame_name = filename.replace('.png', '')
        frames[frame_name] = {
            'frame': {
                'x': x_offset,
                'y': y_offset,
                'w': image.size[0],
                'h': image.size[1]
            },
            'rotated': False,
            'trimmed': False,
            'spriteSourceSize': {
                'x': 0,
                'y': 0,
                'w': image.size[0],
                'h': image.size[1]
            },
            'sourceSize': {
                'w': image.size[0],
                'h': image.size[1]
            },
            'pivot': {
                'x': 0.5,
                'y': 0.5
            }
        }
        x_offset += image.size[0]
        row_height = max(row_height, image.size[1])
    
    metadata = {
        'app': 'http://www.codeandweb.com/texturepacker',
        'version': '1.0',
        'image': 'atlas.png',
        'format': 'RGBA8888',
        'size': {
            'w': atlas_width,
            'h': atlas_height
        },
        'scale': '1'
    }
    
    atlas_data = {
        'frames': frames,
        'meta': metadata
    }
    
    # Define output paths
    output_image_path = os.path.join(folder_path, 'atlas.png')
    output_data_path = os.path.join(folder_path, 'atlas.json')
    
    # Save the atlas image and data
    atlas.save(output_image_path)
    with open(output_data_path, 'w') as f:
        json.dump(atlas_data, f, indent=4)
    
    print(f"Texture atlas created and saved as {output_image_path}")
    print(f"Metadata saved as {output_data_path}")

def process_all_subfolders(input_folder):
    for root, dirs, files in os.walk(input_folder):
        if root != input_folder:
            create_texture_atlas_in_folder(root)

if __name__ == "__main__":
    input_folders = ['../gui-client/public/assets/images/characters/mage', 
                     '../gui-client/public/assets/images/characters/knight',
                     '../gui-client/public/assets/images/characters/priest',
                     '../gui-client/public/assets/images/characters/rogue',]
    print("Creating texture atlases...")
    for folder in input_folders:
        process_all_subfolders(folder)
    print('All texture atlases created.')
    # input_folder = input("Enter the path to the input folder: ")
    
    # if os.path.isdir(input_folder):
    #     create_texture_atlas(input_folder)
    # else:
    #     print("Invalid input folder path.")
