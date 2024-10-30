# LLM Evaluation Chatbot

## Overview

The LLM Evaluation Chatbot is a web application that interacts with a language model hosted on Hugging Face. Users can submit prompts and receive generated responses, which can then be rated for quality. This project demonstrates the integration of a backend API with a React frontend, focusing on user interaction and real-time data fetching.

## Features

- **Prompt Submission**: Users can enter prompts to query the language model.
- **Response Display**: The chatbot displays generated responses from the Hugging Face API.
- **Response Rating**: Users can rate the quality of the generated responses on a scale of 1 to 5.
- **Loading Indicator**: A loading state is displayed while the API is processing requests.

## Technologies Used

- **Frontend**: 
  - React
  - Axios (for API requests)
- **Backend**: 
  - TypeScript
  - Express.js
  - Hugging Face API
- **Database**: 
  - SQLite (for storing ratings and responses)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/PhilJotham14/llm-evaluation-chatbot.git
   cd llm-evaluation-chatbot
2. cd backend
   ```bash
   npm install

3. Start the backend server:
   ```bash
   npx ts-node server.ts

4. Navigate to the frontend directory and install dependencies:
   ```bash
   cd ../frontend
   npm install

5. Start the frontend application:
   ```bash
   npm start

6. Open your browser and navigate to http://localhost:3000.

## Usage
- Enter a prompt in the input field and click Submit Prompt.
- The chatbot will display the generated response below the input field.
- Rate the response using the rating input and click Submit Rating.
