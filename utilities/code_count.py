import os
import sys

def count_lines_and_words(directory):
    total_lines = 0
    total_words = 0
    file_counts = {}

    for root, _, files in os.walk(directory):
        if 'node_modules' in root:
            continue
        for file in files:
            if file.endswith('.js'):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        lines = f.readlines()
                        num_lines = len(lines)
                        num_words = sum(len(line.split()) for line in lines)

                        total_lines += num_lines
                        total_words += num_words

                        file_counts[file_path] = {
                            'lines': num_lines,
                            'words': num_words
                        }
                except Exception as e:
                    print(f"Error reading {file_path}: {e}")

    return total_lines, total_words, file_counts

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python count_lines.py <directory>")
        sys.exit(1)

    target_directory = sys.argv[1]
    total_lines, total_words, file_counts = count_lines_and_words(target_directory)

    print(f"Total lines of code: {total_lines}")
    print(f"Total words of code: {total_words}")
