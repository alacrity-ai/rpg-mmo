import sys
import os
from pydub import AudioSegment

def convert_to_wav(input_file, output_wav_file):
    # Determine the format of the input file
    file_extension = os.path.splitext(input_file)[1].lower()
    
    if file_extension in ['.mp3', '.mp4']:
        # Load the input file
        audio = AudioSegment.from_file(input_file, format=file_extension[1:])
        # Export the audio to WAV format
        audio.export(output_wav_file, format="wav")
    else:
        raise ValueError("Unsupported file format. Only MP3 and MP4 are supported.")

def truncate_and_fade_wav(input_wav_file, output_file, duration=60, fade_duration=2000):
    # Load the WAV file
    audio = AudioSegment.from_wav(input_wav_file)
    
    # Truncate to the specified duration (in milliseconds)
    truncated_audio = audio[:duration * 1900]
    
    # Add fade-in and fade-out effects
    faded_audio = truncated_audio.fade_in(fade_duration).fade_out(fade_duration)
    
    # Export the modified audio to a new WAV file
    faded_audio.export(output_file, format="wav")

def convert_wav_to_mp3(input_wav_file, output_mp3_file):
    # Load the WAV file
    audio = AudioSegment.from_wav(input_wav_file)
    # Export the audio to MP3 format
    audio.export(output_mp3_file, format="mp3")

def main(input_file):
    # Get the base name of the input file (without extension)
    base_name = os.path.splitext(input_file)[0]
    intermediate_wav_file = f"{base_name}_intermediate.wav"
    output_wav_file = f"{base_name}_truncated.wav"
    final_mp3_file = f"{base_name}_final.mp3"
    
    # Convert the input file to WAV
    convert_to_wav(input_file, intermediate_wav_file)
    
    # Truncate and fade the WAV file
    truncate_and_fade_wav(intermediate_wav_file, output_wav_file)
    
    # Convert the truncated and faded WAV file back to MP3
    convert_wav_to_mp3(output_wav_file, final_mp3_file)
    
    # Replace the original MP3 file with the new truncated MP3 file
    os.replace(final_mp3_file, input_file)
    
    # Clean up intermediate files
    os.remove(intermediate_wav_file)
    os.remove(output_wav_file)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script.py <input_file>")
        sys.exit(1)
    
    input_file = sys.argv[1]
    main(input_file)
