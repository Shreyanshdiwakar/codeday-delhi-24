import React, { useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import axios from 'axios';
import { gsap } from 'gsap';
import "./index.css"
import './App.css'; // Add custom styles if needed

function App() {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Animations using GSAP on mount
    gsap.from('.heading', { opacity: 0, y: -50, duration: 1 });
    gsap.from('.upload-section', { opacity: 0, x: -100, duration: 1, delay: 0.5 });
    gsap.from('.actions', { opacity: 0, scale: 0, duration: 1, delay: 1 });
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      gsap.fromTo('.uploaded-image', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.5 });
    }
  };

  const extractTextFromImage = () => {
    if (!image) return;
    setLoading(true);
    gsap.to('.loading-text', { opacity: 1, yoyo: true, repeat: -1, duration: 0.5 });

    Tesseract.recognize(image, 'eng', { logger: (m) => console.log(m) })
      .then(({ data: { text } }) => {
        console.log('Extracted text:', text);
        setExtractedText(text);
        sendTextToBackend(text); // Send the extracted text to the backend
      })
      .catch((err) => {
        console.error('Error extracting text:', err);
      })
      .finally(() => {
        setLoading(false);
        gsap.to('.loading-text', { opacity: 0, duration: 0.5 });
      });
  };

  const sendTextToBackend = async (text) => {
    try {
      const response = await axios.post('http://localhost:3001/process-text', { text });
      console.log('Backend response:', response.data);
      setSummary(response.data.summary);
      gsap.fromTo('.summary-section', { opacity: 0 }, { opacity: 1, duration: 1 });
    } catch (error) {
      console.error('Error sending text to backend:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 space-y-6">
      <h1 className="heading text-4xl font-bold text-teal-400">AI Concept Summarizer</h1>

      <div className="upload-section w-full max-w-lg space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-500 file:text-white hover:file:bg-teal-600"
        />
        {image && <img src={image} alt="Uploaded" className="uploaded-image rounded-lg shadow-lg mt-4" />}
      </div>

      <div className="actions space-y-4">
        <button
          onClick={extractTextFromImage}
          disabled={loading || !image}
          className={`px-6 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 focus:outline-none transition-transform duration-300 ease-in-out ${
            loading || !image ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-105'
          }`}
        >
          {loading ? 'Extracting Text...' : 'Extract Text'}
        </button>

        <p className="loading-text text-teal-300 text-sm">{loading && 'Please wait while we process the image...'}</p>
      </div>

      {extractedText && (
        <div className="extracted-text bg-gray-800 p-4 rounded-lg shadow-lg w-full max-w-lg space-y-2">
          <h3 className="text-xl font-semibold text-teal-400">Extracted Text:</h3>
          <p className="text-sm text-gray-200">{extractedText}</p>
        </div>
      )}

      {summary && (
        <div className="summary-section bg-gray-800 p-4 rounded-lg shadow-lg w-full max-w-lg space-y-2">
          <h3 className="text-xl font-semibold text-teal-400">Summary:</h3>
          <p className="text-sm text-gray-200">{summary}</p>
        </div>
      )}
    </div>
  );
}

export default App;
