# LLM Evaluation Chatbot

## Overview

The **LLM Evaluation Chatbot** is a web application that enables users to interact with a language model hosted on Hugging Face. Users can submit prompts, receive generated responses, and rate the quality of these responses. The application combines a robust backend API, a dynamic React-based frontend, and a database for storing user interactions. Data visualization is also integrated for enhanced insights.
![alt text](chatbot1-1.png) ![alt text](chatbot2-1.png)

## Features

- **Prompt Submission**: Users can input queries and receive generated responses from the Hugging Face API.
- **Response Display**: The chatbot presents the generated output in an intuitive interface.
- **Loading Indicator**: Displays a loading spinner while the API processes requests.
- **Data Visualization**: Ratings and interaction metrics are visualized using charts powered by Chart.js.

## Technologies Used

### Frontend:
- **React**: For building a dynamic user interface.
- **Axios**: For managing API requests.
- **Chart.js**: For interactive data visualizations.

### Backend:
- **TypeScript**: Ensures type safety and cleaner code.
- **Express.js**: Provides a lightweight server framework.
- **Hugging Face API**: Handles language model responses.

### Database:
- **SQLite**: Stores user ratings and chatbot interactions for retrieval and analysis.

### Dev Tools:
- **ESLint** and **Prettier**: For code formatting and linting.
- **Jest**: For unit and integration testing.

## Installation

### Clone the Repository:
```bash
git clone https://github.com/PhilJotham14/llm-evaluation-chatbot.git
```

```bash
cd llm-evaluation-chatbot
```

Backend Setup:
Navigate to the backend directory:
```bash
cd backend
```
Install dependencies:
```bash
npm install
```

Start the backend server:
```bash
npx ts-node server.ts
```

Frontend Setup:
Navigate to the frontend directory:
```bash
cd ../frontend
```
Install dependencies:
```bash
npm install
```

Start the frontend application:
```bash
npm start
```
Open the Application:

Access the application in your browser at ``` http://localhost:3000. ```

### Usage
Prompt Submission:
- Enter a prompt in the input field and click Submit Prompt.
- The chatbot will display a generated response below the input field.

View Charts:
- Navigate to the dashboard to view interactive charts representing rating trends and statistics.

Notices
Model Switching: Use alternative models for better responses, such as:

```bash
bert-base-uncased
```
or:
```bash
distilgpt2
```
Example API URL:
```bash
HF_API_URL=https://api-inference.huggingface.co/models/gpt2
```
- Upgrades: For superior performance, consider using advanced models like OpenAI's GPT-4 (requires a subscription).

### Key Updates:
- Chart.js Integration: Added a dedicated section under "Frontend" for technologies and updated "Features" to include data visualization.
- Improved Structure: Clarified installation instructions for easier navigation and setup.
- Enhanced Notices Section: Highlighted the ability to switch models and the benefits of upgrading to paid solutions for better performance.
