# MaintainManage - Full Stack Application

## Overview

MaintainManage is a full-stack application consisting of:

- **Frontend**: React-based app created with create-react-app
- **Backend**: Node.js (Express) server connected to MongoDB for storing job-related data.

This app can be run both locally and in production environments. You can start both the frontend and backend servers simultaneously.

## Requirements

Before running the app, make sure you have the following installed:

- Node.js (v14 or higher recommended)
- MongoDB (or use a MongoDB cloud service like Atlas)
- npm (comes with Node.js)

## Installation

1. Clone the repository
   ```bash
   git clone <your-repository-url>
   cd <your-project-directory>
Frontend Setup
Navigate to the frontend directory (my-react-app):
cd views/my-react-app
Install the frontend dependencies:
npm install
Backend Setup
Navigate to the root project directory:
cd <your-project-directory>
Install the backend dependencies:
npm install
Configuration

Create a .env file in the root directory with the following variables:

MONGODB_URI=<your-mongodb-connection-string>
PORT=5001
Replace <your-mongodb-connection-string> with your actual MongoDB URI (local or cloud).
PORT is the port for the server (defaults to 5001).
Running the App

To run both the frontend and backend together, you can use the dev script. It runs the backend server and the React app simultaneously.

From the root directory, run:

npm run dev
This will start:

The backend server at http://localhost:5001
The frontend React app at http://localhost:3000
The frontend will automatically proxy API requests to the backend.

For the frontend:
npm start: Starts the React development server on http://localhost:3000
npm run build: Creates a production build of the React app.
For the backend:
npm run server: Starts the Express server on the configured PORT (default 5001).
npm run dev: Starts both the frontend and backend servers concurrently.
Development

Frontend
The frontend is a React app created with create-react-app. You can update or add components as needed.

Backend
The backend is built using Express and connected to MongoDB. All routes are handled in the jobRoutes.js file, and the server is set up in server.js.
