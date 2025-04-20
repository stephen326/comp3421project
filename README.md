# Voting System Project

This is a voting system project built with React and Node.js. It supports creating polls, querying polls, and viewing real-time poll results.

## Project Structure

```
comp3421project/
├── backend/                # Backend code
│   ├── db/                 # Database-related files
│   │   ├── db.js           # Database connection pool configuration
│   │   ├── initDb.js       # Database initialization script
│   ├── routes/             # Backend routes
│   │   ├── createpollapi.js # API route for creating polls
│   │   ├── getResult.js    # API route for fetching poll results
│   ├── .env.sample         # Sample environment variables file
│   ├── pollSocket.js       # WebSocket logic
│   ├── server.js           # Backend entry point
│   ├── package.json        # Backend dependencies
├── frontend/               # Frontend code
│   ├── public/             # Static assets
│   │   ├── index.html      # Frontend HTML template
│   │   ├── manifest.json   # PWA configuration
│   ├── src/                # React source code
│   │   ├── components/     # React components
│   │   │   ├── CreatePoll.js # Poll creation page
│   │   │   ├── Home.js     # Homepage
│   │   ├── styles/         # CSS styles
│   │   │   ├── createpoll.css # Styles for poll creation page
│   │   ├── App.js          # React main entry point
│   │   ├── index.js        # React rendering entry point
│   │   ├── QueryPage.jsx   # Voting page
│   │   ├── ResultPage.jsx  # Real-time results page
│   ├── tailwind.config.js  # TailwindCSS configuration
│   ├── package.json        # Frontend dependencies
├── .gitignore              # Git ignore file
├── README.md               # Project documentation
```

## Environment Setup

### Backend

1. Create a `.env` file based on the `backend/.env.sample` file:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=12345
   DB_DATABASE=comp3421
   DB_PORT=3306
   ```

2. Ensure your local MySQL database is running and matches the `.env` configuration.

3. Install backend dependencies:
   ```bash
   cd backend
   npm i
   ```

### Frontend

1. Ensure Node.js (recommended version: **22.14.0**) and npm are installed.  
   **Note**: Using a Node.js version lower than 22.14.0 may result in errors.

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm i
   ```

## Running the Project

### Start the Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Start the backend server:
   ```bash
   npm start
   ```

### Start the Frontend

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Start the frontend development server:
   ```bash
   npm start
   ```

3. Open your browser and visit [http://localhost:3000](http://localhost:3000).

## Features

1. **Create Polls**: Users can create new polls by providing a title, description, and questions.
2. **Query Polls**: Users can participate in polls by entering a poll ID on the **QueryPage**.
3. **View Results**: Real-time poll results are displayed on the **ResultPage** using various chart types.

## Tech Stack

- **Frontend**: React, TailwindCSS, Chart.js
- **Backend**: Node.js, Express, MySQL, Socket.IO
- **Database**: MySQL

## Notes

1. Ensure the backend and frontend ports are correctly configured. By default, the frontend communicates with the backend at `http://localhost:5000`.
2. If you need to change the port or database configuration, update the `.env` file and the frontend API URLs accordingly.