import sys
from ollama import OllamaModel  # Importing the Ollama model

def summarize_text(input_text):
    # Here you would load and run the Ollama model
    # This is a simplified example of how you could process the text

    # Assuming you have a function in Ollama to summarize text
    model = OllamaModel('/home/harshit/.ollama/models')  # Specify the path to the locally installed Ollama model
    result = model.generate_summary(input_text)  # Example function that generates a summary
    return result

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("No text input provided.")
        sys.exit(1)
    
    # The extracted text is passed as an argument from Node.js
    input_text = sys.argv[1]
    summary = summarize_text(input_text)
    
    # Output the summary for Node.js to capture and send back to the frontend
    print(summary)
