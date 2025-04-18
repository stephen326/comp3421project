import logo from './logo.svg';
import './index.css';
import ResultPage from './ResultPage';
import QueryPage from './QueryPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateSurvey from './components/CreateSurvey';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ResultPage />} />
        <Route path="/create-survey" element={<CreateSurvey />} />
      </Routes>
    </Router>
  );
}

export default App;
