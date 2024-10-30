import express, { Request, Response, RequestHandler } from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb, createTable } from './db';
import { Database as SqliteDatabase } from 'sqlite';
import { promisify } from 'util';

dotenv.config(); // Load environment variables
// console.log('API Key:', process.env.HUGGING_FACE_API_KEY);

const app = express();
const port = 4000;

const HF_API_URL = 'https://api-inference.huggingface.co/models/gpt2';
const HF_API_KEY = process.env.HUGGING_FACE_API_KEY;

app.use(cors());
app.use(express.json());

let db: SqliteDatabase;

initDb()
    .then(async (database) => {
        db = database;
        await createTable(db);
        console.log('Database initialized and table created.');
    })
    .catch((error: unknown) => {
        console.error(
            'Database initialization error:',
            error instanceof Error ? error.message : error
        );
    });

const runAsync = (sql: string, params: any[]) =>
    new Promise<void>((resolve, reject) => {
        db.run(sql, params, (err: Error | null) => {
            if (err) reject(err);
            else resolve();
        });
    });

const handlePrompt: RequestHandler = async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        res.status(400).json({ error: 'Prompt is required' });
        return;
    }

    console.log('Received prompt:', prompt); // Added logging

    try {
        const response = await axios.post(
            HF_API_URL,
            { inputs: prompt },
            { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
        );

        console.log('Response from Hugging Face:', response.data); // Added logging

        const generatedResponse =
            response.data[0]?.generated_text || 'No response generated.';

        await runAsync(
            'INSERT INTO responses (prompt, response) VALUES (?, ?)',
            [prompt, generatedResponse]
        );

        res.json({ prompt, response: generatedResponse });
    } catch (error: unknown) {
        console.error(
            'Error fetching Hugging Face response:',
            error instanceof Error ? error.message : error
        );
        res.status(500).json({ error: 'Error processing prompt' });
    }
};

const handleRate: RequestHandler = async (req, res) => {
    const { id, rating } = req.body;
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        res.status(400).json({ error: 'Valid rating (1-5) is required' });
        return;
    }

    try {
        const sql = 'UPDATE responses SET rating = ? WHERE id = ?';
        await runAsync(sql, [rating, id]);

        res.json({ message: 'Rating submitted' });
    } catch (error: unknown) {
        console.error(
            'Error submitting rating:',
            error instanceof Error ? error.message : error
        );
        res.status(500).json({ error: 'Error submitting rating' });
    }
};

app.post('/api/prompt', handlePrompt);
app.post('/api/rate', handleRate);

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});



// import express from 'express';
// import axios from 'axios';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import { initDb, createTable } from './db';

// dotenv.config();
// const app = express();
// const port = 4000;

// const HF_API_URL = 'https://api-inference.huggingface.co/v1/';
// const HF_API_KEY = process.env.HUGGING_FACE_API_KEY;

// app.use(cors());  // Enable CORS
// app.use(express.json());

// let db: any;

// // Initialize the database and create the table when the server starts
// initDb()
//     .then(async (database) => {
//         db = database;
//         await createTable(db);
//         console.log('Database initialized and table created.');
//     })
//     .catch((error) => console.error('Database initialization error:', error));

// // Endpoint: Handle user prompts and generate responses
// app.post('/api/prompt', async (req, res) => {
//     const { prompt } = req.body;
//     try {
//         const response = await axios.post(
//             HF_API_URL,
//             { inputs: prompt },
//             { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
//         );

//         const generatedResponse = response.data[0]?.generated_text || '';

//         // Insert response into the database
//         await db.run(
//             'INSERT INTO responses (prompt, response) VALUES (?, ?)',
//             [prompt, generatedResponse]
//         );

//         res.json({ prompt, response: generatedResponse });
//     } catch (error) {
//         console.error('Error fetching Hugging Face response:', error);
//         res.status(500).json({ error: 'Error processing prompt' });
//     }
// });

// // Endpoint: Submit feedback ratings for responses
// app.post('/api/rate', async (req, res) => {
//     const { id, rating } = req.body;
//     try {
//         // Update the rating in the database
//         await db.run(
//             'UPDATE responses SET rating = ? WHERE id = ?',
//             [rating, id]
//         );

//         res.json({ message: 'Rating submitted' });
//     } catch (error) {
//         console.error('Error submitting rating:', error);
//         res.status(500).json({ error: 'Error submitting rating' });
//     }
// });

// app.listen(port, () => {
//     console.log(`Backend server running on http://localhost:${port}`);
// });
