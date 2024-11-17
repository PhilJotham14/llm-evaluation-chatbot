// server.ts
import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb, createTable } from './db';
import { Database as SqliteDatabase } from 'sqlite';

dotenv.config();

const app = express();
const port = 4000;

const HF_API_URL = 'https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct';
const HF_API_KEY = process.env.HUGGING_FACE_API_KEY;

app.use(cors());
app.use(express.json());

let db: SqliteDatabase | null = null;

// Initialize the database before starting the server
const initializeDb = async () => {
    try {
        db = await initDb();
        await createTable(db);
        console.log('Database initialized and table created.');
    } catch (error) {
        console.error('Database initialization error:', error);
        process.exit(1);
    }
};

// Handle prompt request
const handlePrompt: RequestHandler = async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        res.status(400).json({ error: 'Prompt is required' });
        return;
    }

    try {
        const response = await axios.post(
            HF_API_URL,
            { inputs: prompt },
            {
                headers: { Authorization: `Bearer ${HF_API_KEY}` },
                timeout: 10000,
            }
        );

        const generatedResponse = response.data[0]?.generated_text || 'No response generated.';
        res.json({ prompt, response: generatedResponse });
    } catch (error: unknown) {
        console.error('Error processing prompt:', error);
        res.status(500).json({ error: 'Error processing prompt' });
    }
};

// API routes
app.post('/api/prompt', handlePrompt);

// Start the server after database initialization is complete
const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

// Export the app and server for testing purposes
export { app, server }; // Export both for testing
