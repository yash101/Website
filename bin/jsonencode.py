import json
import sys

def escape_json_string(input_text):
    return json.dumps(input_text)[1:-1]  # Strip the outer quotes

if __name__ == "__main__":
    if sys.stdin.isatty():
        input_text = input("Enter text: ")
    else:
        input_text = sys.stdin.read().strip()
    
    print(escape_json_string(input_text))

