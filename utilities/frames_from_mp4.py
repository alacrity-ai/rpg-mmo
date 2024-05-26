import cv2
import os
import sys

def extract_frames(video_path, output_folder, width=1000, height=562):
    if not os.path.exists(video_path):
        print(f"File {video_path} does not exist.")
        return
    
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    
    video_capture = cv2.VideoCapture(video_path)
    
    if not video_capture.isOpened():
        print(f"Error opening video file {video_path}")
        return

    frame_count = 0
    success, frame = video_capture.read()
    while success:
        resized_frame = cv2.resize(frame, (width, height))
        frame_filename = os.path.join(output_folder, f"frame_{frame_count:04d}.png")
        cv2.imwrite(frame_filename, resized_frame)
        print(f"Saved {frame_filename}")
        frame_count += 1
        success, frame = video_capture.read()
    
    video_capture.release()
    print(f"Extracted {frame_count} frames from {video_path}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python extract_frames.py <video_path>")
        sys.exit(1)
    
    video_path = sys.argv[1]
    output_folder = os.path.dirname(video_path)
    extract_frames(video_path, output_folder)
