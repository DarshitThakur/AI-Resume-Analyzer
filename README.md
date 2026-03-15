# SmartHire - Resume Analyzer & Job Matcher

SmartHire is a full-stack web application built using the MERN stack that automates resume screening. It analyzes uploaded resumes, extracts required skills using a matching algorithm, and scores them against job descriptions.

## Tech Stack
- **Frontend:** React (Vite), React Router, Vanilla CSS
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), `pdf-parse`

## Project Structure
```text
project-root/
│── backend/
│   ├── controllers/      # Route logic for analysis
│   ├── models/           # Mongoose schemas (User, Analysis)
│   ├── routes/           # Express API endpoints
│   ├── server.js         # Entry point for backend
│   └── skills.json       # Predefined developer skills
│
└── frontend/
    ├── public/
    └── src/
        ├── components/   # UploadResume, JobDescriptionInput, etc.
        ├── pages/        # Home, ResultsDashboard
        ├── services/     # API Axios calls
        ├── App.jsx       # Main App Routing
        └── index.css     # Premium application styles
```

## Local Setup (IDE Instructions)

The application has been unified so that both the backend and frontend run together on a single server port (`5000`).

### Prerequisites
- Install **Node.js** (v18 or higher recommended).
- Install an IDE (e.g., **VS Code**, IntelliJ, or WebStorm).
- Ensure **MongoDB** is running locally (or update the `.env` connection string).

### How to Run in VS Code (or any IDE)
1. Open the root `project` folder (`Ai Resume Analyzer`) in your IDE.
2. Open a new built-in terminal window in your IDE.
3. First, you need to build the frontend. Navigate to the frontend folder and run the build command:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
4. Next, navigate to the backend folder and start the main server:
   ```bash
   cd ../backend
   npm install
   node server.js
   ```
5. The unified application is now running. Open your browser and go to: **`http://localhost:5000`**

*(Note: If you make changes to the React code in `frontend/src`, you will need to re-run `npm run build` in the frontend folder for the changes to appear on port 5000. Alternatively, for active frontend development, you can run `npm run dev` in the frontend folder and visit `http://localhost:5173` for hot-reloading).*

## Deployment Instructions

### Database Deployment (MongoDB Atlas)
1. In MongoDB Atlas, create a new cluster and grab the connection URL.
2. Provide the connection string via the `MONGODB_URI` environment variable on the backend host.

### Backend Deployment (Render)
1. Push your repository to GitHub.
2. Log into Render and create a new Web Service.
3. Select your repository. Use `backend` as the Root Directory.
4. Set the build command to `npm install` and the start command to `node server.js`.
5. Add an Environment Variable for `MONGODB_URI` mapping to your production Atlas database.

### Frontend Deployment (Vercel)
1. Log into Vercel and Import your Project.
2. Select the `frontend` folder as the Root Directory.
3. The Vite framework preset should automatically detect `npm run build` and `dist` output directory.
4. Add an Environment Variable `VITE_API_URL` to point to your live Render backend URL (e.g., `https://my-backend.onrender.com/api`).
5. Click Deploy!
