# Rule Evaluation App

This application allows users to evaluate rules based on user data. Users can select rules, combine them, and check if specific user data meets the criteria defined by the selected rules.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup](#setup)
  - [Prerequisites](#prerequisites)
  - [Clone the Repository](#clone-the-repository)
  - [Install Dependencies](#install-dependencies)
  - [Environment Variables](#environment-variables)
  - [Start the Backend Server](#start-the-backend-server)
  - [Start the Frontend Application](#start-the-frontend-application)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- Fetch and display rules from the server.
- Select multiple rules for combining.
- Evaluate selected rules against user data.
- Dynamic user input for age, department, salary, and experience.
- User-friendly UI with loading indicators and error handling.

## Technologies Used

- **Frontend**: React, Material-UI (MUI), Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Development Tools**: Git, npm

## Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or above)
- [npm](https://www.npmjs.com/) (Node Package Manager, usually comes with Node.js)
- [MongoDB](https://www.mongodb.com/) (for database management)

### Clone the Repository

1. Open your terminal.
2. Clone the repository using the following command:
   ```bash
   git clone <repository-url>

   ```

   cd <project-name>

## Install Dependencies

  ### 1. Navigate to the backend folder:

   cd backend

  ## Install the necessary backend packages:

   npm install

  ### 2. Navigate to the frontend folder:

   cd ../frontend
   
  ## Install the necessary frontend packages:

   npm install

 ## Environment Variables

    Create a .env file in the backend directory.
## Add the following environment variables to the .env file:

PORT=5000
MONGODB_URI=<your-mongodb-uri>

Replace <your-mongodb-uri> with your actual MongoDB connection string.

Start the Backend Server

  ### Navigate back to the backend directory if not already there:

    cd backend

  ### Start the backend server:

    npm start  or npm run dev

The backend server will run on http://localhost:5000.

 ## Start the Frontend Application

   ### open a new terminal window and navigate to the frontend directory:

     cd frontend

 ## Start the frontend React application:

    npm start

The frontend will run on http://localhost:3000.


# Usage
Open your browser and navigate to http://localhost:3000.
You will see a list of rules fetched from the backend.
Select the rules you want to combine and evaluate.
Input user data in the provided fields (age, department, salary, experience).
Click "Evaluate" to check if the user data meets the criteria of the selected rule(s).
Click "Combine Selected Rules" to combine your selections.


# API Endpoints
Fetch All Rules: GET /api/rules
Combine Selected Rules: POST /api/rules/combine
Evaluate a Rule: POST /api/rules/evaluate

Refer to the API documentation for more details on each endpoint.

