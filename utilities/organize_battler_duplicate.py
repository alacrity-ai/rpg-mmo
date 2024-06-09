import os
import shutil
import argparse

def duplicate_subfolders(target_folder):
    # Ensure the target folder exists
    if not os.path.isdir(target_folder):
        print(f"Target folder {target_folder} does not exist.")
        return

    # List of new subfolders to create
    new_subfolders = ['cast', 'combat', 'portrait', 'hit', 'die']
    
    # Iterate over all subfolders in the target folder
    for subfolder in os.listdir(target_folder):
        subfolder_path = os.path.join(target_folder, subfolder)
        
        if os.path.isdir(subfolder_path):
            idle_folder_path = os.path.join(subfolder_path, 'idle')
            
            if os.path.isdir(idle_folder_path):
                # Get the .png file in the idle folder
                png_files = [f for f in os.listdir(idle_folder_path) if f.endswith('.png')]
                
                for png_file in png_files:
                    idle_file_path = os.path.join(idle_folder_path, png_file)
                    
                    for new_subfolder in new_subfolders:
                        new_subfolder_path = os.path.join(subfolder_path, new_subfolder)
                        os.makedirs(new_subfolder_path, exist_ok=True)
                        new_file_path = os.path.join(new_subfolder_path, png_file)
                        
                        # Copy the png file to the new subfolder
                        shutil.copy2(idle_file_path, new_file_path)
                        print(f"Copied {png_file} to {new_file_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Duplicate idle subfolder into new subfolders")
    parser.add_argument("target_folder", help="The target folder containing subfolders")
    args = parser.parse_args()
    
    duplicate_subfolders(args.target_folder)
