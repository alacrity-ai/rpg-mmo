import os
import sys
import argparse
from PIL import Image, ImageEnhance
from sklearn.cluster import KMeans
import numpy as np

def rename_files_in_folder(folder_path):
    try:
        image_files = [f for f in os.listdir(folder_path) if f.endswith('.webp')]
        for i, image_file in enumerate(image_files):
            new_name = f"area_{i}.png"
            os.rename(os.path.join(folder_path, image_file), os.path.join(folder_path, new_name))
        print("Files renamed successfully.")
    except Exception as e:
        print(f"Error renaming files: {e}")

def resize_image(image_path, output_path, width, height, num_colors, saturation):
    try:
        # Open the image
        image = Image.open(image_path)
        
        # Resize the image
        resized_image = image.resize((width, height), Image.Resampling.LANCZOS)
        
        # Save the resized image temporarily
        resized_temp_path = f"{output_path}_temp.png"
        resized_image.save(resized_temp_path)
        
        # Reduce the color palette
        reduce_color_palette(resized_temp_path, output_path, num_colors)
        
        # Remove the temporary file
        os.remove(resized_temp_path)
        
        # Apply saturation adjustment
        adjust_saturation(output_path, output_path, saturation)
        
    except Exception as e:
        print(f"Error processing image {image_path}: {e}")

def reduce_color_palette(image_path, output_path, num_colors):
    try:
        # Open the image
        image = Image.open(image_path)
        
        # Convert image to array
        arr = np.array(image)
        
        # Check if image has an alpha channel
        if arr.shape[-1] == 4:
            pixels = arr.reshape((-1, 4))
        else:
            pixels = arr.reshape((-1, 3))
        
        # Use KMeans to find the most common colors
        kmeans = KMeans(n_clusters=num_colors)
        kmeans.fit(pixels[..., :3])
        new_colors = kmeans.cluster_centers_[kmeans.predict(pixels[..., :3])]
        
        # Convert the new colors to integers
        new_colors = new_colors.astype(int)
        
        # If the image had an alpha channel, add it back
        if arr.shape[-1] == 4:
            new_image_array = np.concatenate([new_colors, pixels[..., 3:]], axis=-1).reshape(arr.shape)
        else:
            new_image_array = new_colors.reshape(arr.shape)
        
        # Convert back to image
        new_image = Image.fromarray(new_image_array.astype('uint8'), 'RGBA' if arr.shape[-1] == 4 else 'RGB')
        
        # Save the processed image
        new_image.save(output_path)
    except Exception as e:
        print(f"Error reducing color palette for image {image_path}: {e}")

def adjust_saturation(image_path, output_path, saturation):
    try:
        # Open the image
        image = Image.open(image_path)
        
        # Apply saturation enhancement
        enhancer = ImageEnhance.Color(image)
        enhanced_image = enhancer.enhance(saturation)
        
        # Save the enhanced image
        enhanced_image.save(output_path)
    except Exception as e:
        print(f"Error adjusting saturation for image {image_path}: {e}")

def process_png_images_in_folder(folder_path, width, height, num_colors, saturation):
    # Rename files first
    rename_files_in_folder(folder_path)

    # Get all renamed png files in the folder
    renamed_image_files = [f for f in os.listdir(folder_path) if f.startswith('area_') and f.endswith('.png')]

    # Process each renamed png file
    for image_file in renamed_image_files:
        image_path = os.path.join(folder_path, image_file)
        output_path = os.path.join(folder_path, image_file)  # Output path is same as input path to overwrite
        resize_image(image_path, output_path, width, height, num_colors, saturation)
        print(f"Resized and processed {image_file} -> {output_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Resize and reduce color palette of PNG images.')
    parser.add_argument('folder_path', type=str, help='Path to the folder containing PNG images.')
    parser.add_argument('--width', type=int, default=1000, help='Width to resize images to (default: 1000).')
    parser.add_argument('--height', type=int, default=562, help='Height to resize images to (default: 562).')
    parser.add_argument('--colorpalette', type=int, default=16, help='Max colors in the final output (default: 16).')
    parser.add_argument('--saturation', type=float, default=1, help='Saturation level for the final output (default: 1).')

    args = parser.parse_args()

    process_png_images_in_folder(args.folder_path, args.width, args.height, args.colorpalette, args.saturation)
