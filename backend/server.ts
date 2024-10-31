import express, { RequestHandler } from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb, createTable } from './db';
import { Database as SqliteDatabase } from 'sqlite';

dotenv.config(); // Load environment variables

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
        await db.run('PRAGMA journal_mode=WAL;'); // Enable WAL mode
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

    console.log('Received prompt:', prompt);

    try {
        const response = await axios.post(
            HF_API_URL,
            { inputs: prompt },
            {
                headers: { Authorization: `Bearer ${HF_API_KEY}` },
                timeout: 5000,
            }
        );

        const generatedResponse =
            response.data[0]?.generated_text || 'No response generated.';

        res.json({ prompt, response: generatedResponse });

        runAsync('INSERT INTO responses (prompt, response) VALUES (?, ?)', [
            prompt,
            generatedResponse,
        ]).catch((error) =>
            console.error('DB Insert Error:', error instanceof Error ? error.message : error)
        );
    } catch (error: unknown) {
        console.error(
            'Error fetching Hugging Face response:',
            error instanceof Error ? error.message : error
        );
        res.status(500).json({ error: 'Error processing prompt' });
    }
};

const handleRate: RequestHandler = (req, res) => {
    const { id, rating } = req.body;
    const start = Date.now(); // Track start time

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        res.status(400).json({ error: 'Valid rating (1-5) is required' });
        return;
    }

    const sql = 'UPDATE responses SET rating = ? WHERE id = ?';

    // Use runAsync to handle the database operation
    runAsync(sql, [rating, id])
        .then(() => {
            const duration = Date.now() - start; // Log how long it took
            console.log(`Rating submitted in ${duration}ms`);

            res.json({ message: 'Rating submitted' });
        })
        .catch((error: unknown) => {
            console.error(
                'Error submitting rating:',
                error instanceof Error ? error.message : error
            );
            res.status(500).json({ error: 'Error submitting rating' });
        });
};

app.post('/api/prompt', handlePrompt);
app.post('/api/rate', handleRate);

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});



// import express, { RequestHandler } from 'express';
// import axios from 'axios';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import { initDb, createTable } from './db';
// import { Database as SqliteDatabase } from 'sqlite';

// dotenv.config(); // Load environment variables

// const app = express();
// const port = 4000;

// const HF_API_URL = 'https://api-inference.huggingface.co/models/gpt2';
// const HF_API_KEY = process.env.HUGGING_FACE_API_KEY;

// app.use(cors());
// app.use(express.json());

// let db: SqliteDatabase;

// initDb()
//     .then(async (database) => {
//         db = database;
//         await createTable(db);
//         await db.run('PRAGMA journal_mode=WAL;'); // Enable WAL mode
//         console.log('Database initialized and table created.');
//     })
//     .catch((error: unknown) => {
//         console.error(
//             'Database initialization error:',
//             error instanceof Error ? error.message : error
//         );
//     });

// const runAsync = (sql: string, params: any[]) =>
//     new Promise<void>((resolve, reject) => {
//         db.run(sql, params, (err: Error | null) => {
//             if (err) reject(err);
//             else resolve();
//         });
//     });

// const handlePrompt: RequestHandler = async (req, res) => {
//     const { prompt } = req.body;
//     if (!prompt) {
//         res.status(400).json({ error: 'Prompt is required' });
//         return;
//     }

//     console.log('Received prompt:', prompt);

//     try {
//         const response = await axios.post(
//             HF_API_URL,
//             { inputs: prompt },
//             {
//                 headers: { Authorization: `Bearer ${HF_API_KEY}` },
//                 timeout: 5000,
//             }
//         );

//         // console.log('Response from Hugging Face:', response.data);

//         const generatedResponse =
//             response.data[0]?.generated_text || 'No response generated.';

//         res.json({ prompt, response: generatedResponse });

//         runAsync('INSERT INTO responses (prompt, response) VALUES (?, ?)', [
//             prompt,
//             generatedResponse,
//         ]).catch((error) =>
//             console.error('DB Insert Error:', error instanceof Error ? error.message : error)
//         );
//     } catch (error: unknown) {
//         console.error(
//             'Error fetching Hugging Face response:',
//             error instanceof Error ? error.message : error
//         );
//         res.status(500).json({ error: 'Error processing prompt' });
//     }
// };

// const handleRate: RequestHandler = async (req, res) => {
//     const { id, rating } = req.body;
//     const start = Date.now(); // Track start time

//     if (typeof rating !== 'number' || rating < 1 || rating > 5) {
//         res.status(400).json({ error: 'Valid rating (1-5) is required' });
//         return;
//     }

//     try {
//         await db.run('BEGIN TRANSACTION;');
//         const sql = 'UPDATE responses SET rating = ? WHERE id = ?';
//         await runAsync(sql, [rating, id]);
//         await db.run('COMMIT;');

//         const duration = Date.now() - start; // Log how long it took
//         console.log(`Rating submitted in ${duration}ms`);

//         res.json({ message: 'Rating submitted' });
//     } catch (error: unknown) {
//         await db.run('ROLLBACK;');
//         console.error(
//             'Error submitting rating:',
//             error instanceof Error ? error.message : error
//         );
//         res.status(500).json({ error: 'Error submitting rating' });
//     }
// };

// app.post('/api/prompt', handlePrompt);
// app.post('/api/rate', handleRate);

// app.listen(port, () => {
//     console.log(`Backend server running on http://localhost:${port}`);
// });
