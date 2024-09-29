import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process'; // To run Python scripts

const app = express();

// Middleware to parse incoming JSON and handle CORS
app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {    
    res.send('Hello World!');
});
// Route to process extracted text and run Ollama model
app.post('/process-text', (req, res) => {
    const extractedText = req.body.text;
    console.log("Received text from frontend:", extractedText);

    // Spawn a Python process to run the Ollama model
    const pythonProcess = spawn('python', ['run_ollama.py', extractedText]);

    // Handle Python script output
    pythonProcess.stdout.on('data', (data) => {
        const ollamaResponse = data.toString();
        console.log("Ollama Model Response:", ollamaResponse);
        // Send the response back to the frontend
        res.json({ summary: ollamaResponse });
    });

    // Handle Python script errors
    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error from Python script: ${data}`);
        res.status(500).json({ error: 'Error processing text with Ollama model' });
    });

    // Handle Python process exit
    pythonProcess.on('close', (code) => {
        console.log(`Python process exited with code ${code}`);
    });
});

// Start the server on port 3001
const port = 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});