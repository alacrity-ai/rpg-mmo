import cv2
import os
import sys
import glob
import argparse

def create_video_from_frames(input_folder, output_video, fps=30, width=1000, height=562):
    frame_files = sorted(glob.glob(os.path.join(input_folder, "frame_*.png")),
                         key=lambda x: int(os.path.basename(x).split('_')[1].split('.')[0]))

    if not frame_files:
        print(f"No frames found in {input_folder}")
        return

    fourcc = cv2.VideoWriter_fourcc(*'H264')
    video_writer = cv2.VideoWriter(output_video, fourcc, fps, (width, height), isColor=True)

    for frame_file in frame_files:
        frame = cv2.imread(frame_file)
        if frame is None:
            print(f"Error reading frame {frame_file}")
            continue
        resized_frame = cv2.resize(frame, (width, height))
        video_writer.write(resized_frame)
        print(f"Added {frame_file} to video")

    video_writer.release()
    print(f"Video saved as {output_video}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Combine PNG frames into an MP4 video.")
    parser.add_argument("input_folder", help="Folder containing input PNG frames")
    parser.add_argument("output_video", help="Output MP4 video file")
    parser.add_argument("--fps", type=int, default=6, help="Frames per second for the output video")

    args = parser.parse_args()
    
    create_video_from_frames(args.input_folder, args.output_video, fps=args.fps)
