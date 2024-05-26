from PIL import Image
import sys

def make_background_transparent(image_path):
    img = Image.open(image_path)
    img = img.convert("RGBA")
    
    # Get the data of the image
    datas = img.getdata()
    
    new_data = []
    for item in datas:
        # Check for white background
        if item[:3] == (255, 255, 255):
            new_data.append((255, 255, 255, 0))  # Change white to transparent
        else:
            new_data.append(item)

    img.putdata(new_data)
    img.save(image_path)
    print(f"Processed {image_path} and saved with transparent background.")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script.py <path_to_sprite_png>")
    else:
        sprite_path = sys.argv[1]
        make_background_transparent(sprite_path)
