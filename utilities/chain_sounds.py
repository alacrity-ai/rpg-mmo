import os
import argparse
import wave
from pydub import AudioSegment

def combine_wav_files(input_folder, output_file, delay_ms):
    # List all .wav files in the input folder
    wav_files = [f for f in os.listdir(input_folder) if f.endswith('.wav')]
    wav_files.sort()  # Ensure files are combined in alphabetical order

    # Create an empty AudioSegment for the final combined sound
    combined_sound = AudioSegment.silent(duration=0)

    # Add each wav file to the combined sound with the specified delay
    for wav_file in wav_files:
        sound = AudioSegment.from_wav(os.path.join(input_folder, wav_file))
        combined_sound += sound + AudioSegment.silent(duration=delay_ms)

    # Export the combined sound to a new .wav file
    combined_sound.export(output_file, format="wav")
    print(f"Combined {len(wav_files)} files into {output_file}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Combine WAV files with optional delay")
    parser.add_argument("input_folder", help="Folder containing the WAV files to combine")
    parser.add_argument("output_file", help="Output WAV file")
    parser.add_argument("--delay", type=int, default=0, help="Delay between sounds in milliseconds (default: 0)")

    args = parser.parse_args()
    
    combine_wav_files(args.input_folder, args.output_file, args.delay)
