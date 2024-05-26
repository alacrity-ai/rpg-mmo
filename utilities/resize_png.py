import os
import sys
import argparse
from PIL import Image
from sklearn.cluster import KMeans
import numpy as np

def resize_image(image_path, output_path, size, num_colors, remove_background):
    try:
        # Open the image
        image = Image.open(image_path)
        
        # Resize the image
        resized_image = image.resize((size, size), Image.Resampling.LANCZOS)
        
        # Save the resized image temporarily
        resized_temp_path = f"{output_path}_temp.png"
        resized_image.save(resized_temp_path)
        
        # Reduce the color palette
        reduce_color_palette(resized_temp_path, output_path, num_colors)
        
        if remove_background:
            # Remove the background from the resized image
            remove_background_colors(output_path, output_path)
        
        # Remove the temporary file
        os.remove(resized_temp_path)
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

def get_top_left_colors(image, size=4):
    # Crop the top-left corner of the image
    top_left = image.crop((0, 0, size, size))
    # Convert to array
    arr = np.array(top_left)
    # Reshape to a list of pixels
    pixels = arr.reshape(-1, arr.shape[-1])
    # Get unique colors
    unique_colors = np.unique(pixels, axis=0)
    return unique_colors

def remove_background_colors(image_path, output_path, size=16, tolerance=50):
    try:
        # Open the image
        image = Image.open(image_path).convert("RGBA")
        
        # Get the background colors from the top-left corner
        background_colors = get_top_left_colors(image, size=size)
        
        # Convert the image to an array
        arr = np.array(image)
        
        # Create a mask for the background colors
        mask = np.zeros((arr.shape[0], arr.shape[1]), dtype=bool)
        for color in background_colors:
            diff = np.abs(arr[..., :3] - color[:3])
            close_colors = np.all(diff <= tolerance, axis=-1)
            mask |= close_colors
        
        # Apply the mask to make the background transparent
        arr[mask] = [0, 0, 0, 0]
        
        # Create a new image from the array
        transparent_image = Image.fromarray(arr)
        
        # Save the result
        transparent_image.save(output_path)
    except Exception as e:
        print(f"Error removing background colors for image {image_path}: {e}")

def process_png_images_in_folder(folder_path, size, num_colors, remove_background):
    # Get all png files in the folder
    image_files = [f for f in os.listdir(folder_path) if f.endswith('.png')]

    # Process each png file
    for image_file in image_files:
        image_path = os.path.join(folder_path, image_file)
        file_name, file_ext = os.path.splitext(image_file)
        output_path = os.path.join(folder_path, f'{file_name}_{size}{file_ext}')
        resize_image(image_path, output_path, size, num_colors, remove_background)
        print(f"Resized and processed {image_file} -> {output_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Resize and reduce color palette of PNG images.')
    parser.add_argument('folder_path', type=str, help='Path to the folder containing PNG images.')
    parser.add_argument('--size', type=int, default=128, help='Size to resize images to (default: 128).')
    parser.add_argument('--colorpalette', type=int, default=16, help='Max colors in the final output (default: 16).')
    parser.add_argument('--removebackground', type=bool, default=True, help='Whether to remove the background (default: True).')

    args = parser.parse_args()

    process_png_images_in_folder(args.folder_path, args.size, args.colorpalette, args.removebackground)
