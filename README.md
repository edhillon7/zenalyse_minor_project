Zenalyse (Your AI Therapist)








![Screenshot 2025-04-27 212302](https://github.com/user-attachments/assets/cdb84dd1-d906-4f85-9b3b-f46a1150e117)



















Table of Contents

Features
Prerequisites
Project Structure
Setup Instructions
Usage
Running in WSL
Troubleshooting
Contributing
License

Features

Frontend: Responsive UI with pages for landing (login), tech, about, blog, and chat with Zenalyse.
Backend: API endpoints for chat interactions, integrated with Supabase for authentication and Ollama for AI responses.
AI Chatbot: Empathetic and context-aware conversations using the Mistral model via Ollama.

Prerequisites

Node.js (v16 or later) for the frontend.
Python (v3.8 or later) for the backend.
Ollama: To run the Mistral model locally.
Supabase Account: For authentication (create a project at supabase.com).
Git: To clone the repository.
WSL with Ubuntu: For running the project in a Linux environment on Windows.

Project Structure
zenalyse_minor_project/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── App.css
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── ...
├── backend/
│   ├── main.py  (or similar FastAPI file)
│   ├── requirements.txt
│   └── ...
├── .gitignore
└── README.md

Setup Instructions
1. Clone the Repository
git clone https://github.com/edhillon7/zenalyse_minor_project.git
cd zenalyse_minor_project

2. Set Up Ollama with Mistral

Install Ollama:
Follow the instructions at ollama.ai.
In WSL Ubuntu, run:curl https://ollama.ai/install.sh | sh




Pull the Mistral Model:
Start the Ollama service:ollama serve


In a new terminal, pull the Mistral model:ollama pull mistral




Verify Ollama:
Test the model:ollama run mistral "Hello, how can I help you today?"


Ensure Ollama runs on localhost:11434 (default port).



3. Set Up the Backend

Navigate to the Backend Directory:cd backend


Create a Virtual Environment:python3 -m venv venv
source venv/bin/activate


Install Dependencies:
Install required packages:pip install fastapi uvicorn python-dotenv supabase


If you have a requirements.txt, use:pip install -r requirements.txt




Set Up Environment Variables:
Create a .env file:touch .env


Add your Supabase credentials (from your Supabase dashboard):SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
OLLAMA_URL=http://localhost:11434




Run the Backend:uvicorn main:app --host 0.0.0.0 --port 8000 --reload


Verify at http://localhost:8000.



4. Set Up the Frontend

Navigate to the Frontend Directory:cd ../frontend


Install Dependencies:npm install


Set Up Environment Variables:
Create a .env file:touch .env


Add your Supabase credentials:VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_KEY=your-supabase-key




Run the Frontend:npm run dev


Open http://localhost:5173 in your browser.



Usage

Navigate to http://localhost:5173.
Sign in with Google to access the chat feature.
Explore the Tech, About, and Blog pages for more details.

Running in WSL

This project is optimized for WSL with Ubuntu.
Ensure Ollama, frontend, and backend run in the WSL terminal.
Port forwarding in WSL allows access to localhost:5173 and localhost:8000 from your Windows browser.

Troubleshooting

Ollama Not Responding:
Ensure ollama serve is running and the Mistral model is pulled.
Check the OLLAMA_URL in your backend .env.


Backend API Errors:
Verify the FastAPI server is running and .env has correct Supabase credentials.


Frontend Not Loading:
Run npm install and check the browser console for errors.



Contributing
Contributions are welcome! Please:

Fork the repository.
Create a feature branch (git checkout -b feature-name).
Commit changes (git commit -m "Add feature").
Push to the branch (git push origin feature-name).
Open a pull request.

License
This project is licensed under the MIT License.
