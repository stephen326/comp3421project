import logo from './logo.svg';
import './index.css';
import React from 'react';
import ResultPage from './ResultPage';
import QueryPage from './QueryPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreatePoll from './components/CreatePoll'; // Import CreatePoll component
import Home from './components/Home'; // Import Home component
import Thank from './Thank'; // Import Thank component
import NotFoundPage from './NotFoundPage'; // Import NotFoundPage component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-poll" element={<CreatePoll />} />
        <Route path="/query-page/:pollId" element={<QueryPage />} /> {/* Dynamic route */}
        <Route path="/result-page/:pollId" element={<ResultPage />} /> {/* Dynamic route */}
        <Route path="/thank/:pollId" element={<Thank />} />
        <Route path="/not-found" element={<NotFoundPage />} /> {/* Add NotFoundPage route */}
      </Routes>
    </Router>
  );
}

export default App; // Export App component for use in other files
