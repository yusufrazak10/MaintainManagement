# MaintainManage - Full Stack Application

## Overview

**MaintainManage** is a full-stack web application designed for **maintenance management**. It allows users to submit, track, and update job tasks, providing real-time status updates and easy job management. The app enables businesses or teams to streamline their maintenance tasks and ensure everything is handled in an efficient and organized way.

### Importance of the Project

MaintainManage helps users efficiently manage jobs related to maintenance tasks by tracking their status and progress. The application provides a centralized platform for submitting, monitoring, and updating tasks, helping improve team collaboration and task completion.

### What It Does

- **Submit Jobs**: Create a new job request with a description, location, and priority.
- **Track Job Status**: Monitor job statuses (submitted, in progress, completed) and update job information.
- **Batch Updates**: Update statuses of multiple jobs at once.
- **Archive Jobs**: Archive completed or obsolete jobs to keep the list organized.
- **Filter Jobs**: Easily filter jobs by their status.
  
MaintainManage includes both a **frontend** built with React and a **backend** powered by Node.js (Express) and MongoDB, providing a robust solution for maintenance management.

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
npm run server: Starts the Express server on the configured PORT (default 5001)
npm run dev: Starts both the frontend and backend servers concurrently.
Development

Frontend
The frontend is a React app created with create-react-app. You can update or add components as needed.

Backend
The backend is built using Express and connected to MongoDB. All routes are handled in the jobRoutes.js file, and the server is set up in server.js.
