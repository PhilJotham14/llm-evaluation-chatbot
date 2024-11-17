import React, { useState } from "react";
import axios from 'axios';
import SuccessRateChart from './components/SuccessRateChart';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [successCount, setSuccessCount] = useState(0);
  const [failureCount, setFailureCount] = useState(0);

  const handlePromptSubmit = async () => {
    setLoading(true);
    setResponse("");  // Clear previous response

    try {
      const res = await axios.post('http://localhost:4000/api/prompt', { prompt });
      const generatedResponse = res.data.response; // Extract the response from the backend
      setResponse(generatedResponse);

      // Update success count
      setSuccessCount(successCount + 1);
    } catch (error) {
      console.error('Error submitting prompt:', error);
      setResponse("Request failed.");
      setFailureCount(failureCount + 1);  // Increment failure count
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <h1 className="text-4xl font-bold text-center text-gray-800 mt-8 mb-4">
        LLM Evaluation Chatbot
      </h1>

      {/* Prompt Input */}
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt"
        className="w-full max-w-md p-3 mt-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />

      {/* Submit Button */}
      <button
        onClick={handlePromptSubmit}
        disabled={loading}
        className="w-full max-w-md py-3 mt-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
      >
        {loading ? 'Loading...' : 'Submit Prompt'}
      </button>

      {/* Response */}
      {response && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow-lg max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800">Response:</h2>
          <p className="text-gray-600">{response}</p>
        </div>
      )}

      {/* Success Rate Chart (positioned top-right) */}
      <SuccessRateChart
        successCount={successCount}
        failureCount={failureCount}
        className="absolute top-8 right-8 w-1/3 max-w-sm"
      />
    </div>
  );
}

export default App;
