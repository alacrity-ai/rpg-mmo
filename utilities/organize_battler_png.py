import os
import shutil
import argparse

def organize_pngs(target_folder):
    # Ensure the target folder exists
    if not os.path.isdir(target_folder):
        print(f"Target folder {target_folder} does not exist.")
        return

    # Get all .png files in the target folder
    png_files = [f for f in os.listdir(target_folder) if f.endswith('.png')]
    
    for png_file in png_files:
        # Create folder names based on the png file name (minus extension)
        base_name = os.path.splitext(png_file)[0]
        new_folder_path = os.path.join(target_folder, base_name, 'idle')
        
        # Create the new folder and subfolder
        os.makedirs(new_folder_path, exist_ok=True)
        
        # Move the png file into the new subfolder
        original_file_path = os.path.join(target_folder, png_file)
        new_file_path = os.path.join(new_folder_path, png_file)
        shutil.move(original_file_path, new_file_path)
        
        print(f"Moved {png_file} to {new_file_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Organize PNG files into folders")
    parser.add_argument("target_folder", help="The target folder containing .png files")
    args = parser.parse_args()
    
    organize_pngs(args.target_folder)
