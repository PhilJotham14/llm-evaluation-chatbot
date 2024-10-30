import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [rating, setRating] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);

  const handlePromptSubmit = async () => {
    if (!prompt) {
      alert('Please enter a prompt.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:4000/api/prompt', { prompt });
      // Assuming the response structure is similar to: { response: generated_text }
      setResponse(res.data[0]?.generated_text || 'No response received');
      console.log('Response received:', res.data); // Added logging
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching response:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async () => {
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      alert('Please enter a valid rating between 1 and 5.');
      return;
    }

    try {
      await axios.post('http://localhost:4000/api/rate', { id: 1, rating });
      alert('Rating submitted');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error submitting rating:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  return (
    <div>
      <h1>LLM Chatbot</h1>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt"
      />
      <button onClick={handlePromptSubmit} disabled={loading}>
        {loading ? 'Loading...' : 'Submit Prompt'}
      </button>

      {response && (
        <div>
          <h2>Response:</h2>
          <p>{response}</p>
        </div>
      )}

      <div>
        <h2>Rate the Response</h2>
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          placeholder="Enter rating (1-5)"
        />
        <button onClick={handleRatingSubmit}>Submit Rating</button>
      </div>
    </div>
  );
};

export default App;
