import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [rating, setRating] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);

  const handlePromptSubmit = async () => {
    if (!prompt.trim()) {
      alert('Please enter a valid prompt.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:4000/api/prompt', { prompt });
      setResponse(res.data.response || 'No response received');
      console.log('Response received:', res.data);
    } catch (error: unknown) {
      console.error(
        'Error fetching response:',
        error instanceof Error ? error.message : error
      );
      setResponse('Error: Unable to fetch response');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async () => {
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      alert('Please enter a valid rating between 1 and 5.');
      return;
    }

    setRatingLoading(true);
    try {
      await axios.post('http://localhost:4000/api/rate', { id: 1, rating });
      alert('Rating submitted');
    } catch (error: unknown) {
      console.error(
        'Error submitting rating:',
        error instanceof Error ? error.message : error
      );
      alert('Error: Unable to submit rating');
    } finally {
      setRatingLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>LLM Evaluation Chatbot</h1>

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt"
        style={{ marginRight: '10px', width: '300px' }}
      />
      <button onClick={handlePromptSubmit} disabled={loading}>
        {loading ? 'Loading...' : 'Submit Prompt'}
      </button>

      {response && (
        <div style={{ marginTop: '20px' }}>
          <h2>Response:</h2>
          <p>{response}</p>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <h2>Rate the Response</h2>
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          placeholder="Enter rating (1-5)"
          style={{ marginRight: '10px', width: '50px' }}
        />
        <button onClick={handleRatingSubmit} disabled={ratingLoading}>
          {ratingLoading ? 'Submitting...' : 'Submit Rating'}
        </button>
      </div>
    </div>
  );
};

export default App;



// import React, { useState } from 'react';
// import axios from 'axios';

// const App = () => {
//   const [prompt, setPrompt] = useState('');
//   const [response, setResponse] = useState('');
//   const [rating, setRating] = useState<number | ''>('');
//   const [loading, setLoading] = useState(false);
//   const [ratingLoading, setRatingLoading] = useState(false);

//   const handlePromptSubmit = async () => {
//     if (!prompt) {
//       alert('Please enter a prompt.');
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.post('http://localhost:4000/api/prompt', { prompt });
//       setResponse(res.data.response || 'No response received');
//       console.log('Response received:', res.data);
//     } catch (error: unknown) {
//       console.error(
//         'Error fetching response:',
//         error instanceof Error ? error.message : error
//       );
//       setResponse('Error: Unable to fetch response');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRatingSubmit = async () => {
//     if (typeof rating !== 'number' || rating < 1 || rating > 5) {
//       alert('Please enter a valid rating between 1 and 5.');
//       return;
//     }

//     setRatingLoading(true);
//     try {
//       const res = await axios.post('http://localhost:4000/api/rate', { id: 1, rating });
//       alert('Rating submitted');
//       console.log('Rating response:', res.data);
//     } catch (error: unknown) {
//       console.error(
//         'Error submitting rating:',
//         error instanceof Error ? error.message : error
//       );
//     } finally {
//       setRatingLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h1>LLM Evaluation Chatbot</h1>

//       <input
//         type="text"
//         value={prompt}
//         onChange={(e) => setPrompt(e.target.value)}
//         placeholder="Enter your prompt"
//       />
//       <button onClick={handlePromptSubmit} disabled={loading}>
//         {loading ? 'Loading...' : 'Submit Prompt'}
//       </button>

//       {response && (
//         <div>
//           <h2>Response:</h2>
//           <p>{response}</p>
//         </div>
//       )}

//       <div>
//         <h2>Rate the Response</h2>
//         <input
//           type="number"
//           value={rating}
//           onChange={(e) => setRating(Number(e.target.value))}
//           placeholder="Enter rating (1-5)"
//         />
//         <button onClick={handleRatingSubmit} disabled={ratingLoading}>
//           {ratingLoading ? 'Submitting...' : 'Submit Rating'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default App;
