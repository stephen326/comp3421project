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
        <Route path="/result-page" element={<ResultPage />} />
        <Route path="/query-page" element={<QueryPage />} />
        <Route path="/create-survey" element={<CreateSurvey />} />
      </Routes>
    </Router>
  );
}

export default App;
