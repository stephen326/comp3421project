import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // 根据你的后端端口修改
const POLL_ID = 1; // 假设是第一个问卷


// Sample JSON data (in a real app, this would be fetched from a file or API)
const surveyData = {
  title: "Marketing Survey",
  description: "Help us shape the future with your feedback in this quick and fun survey!",
  questions: [
    {
      id: 1,
      text: "How often do you purchase our product?",
      options: ["Daily", "Weekly", "Monthly", "Rarely"]
    },
    {
      id: 2,
      text: "How satisfied are you with our customer service?",
      options: ["Satisfied", "Neutral", "Dissatisfied"]
    },
    {
      id: 3,
      text: "What feature do you value most?",
      options: ["Quality", "Price", "Brand", "Support"]
    }
  ]
};

const QueryPage = () => {
  const [survey, setSurvey] = useState(surveyData);
  const [responses, setResponses] = useState({});

  // Simulate fetching JSON data
  useEffect(() => {
    // In a real app, replace this with an actual fetch call
    // fetch('/path/to/survey.json')
    //   .then(response => response.json())
    //   .then(data => setQuestions(data.questions));
    // setSurvey(surveyData);
  }, []);

  const handleOptionChange = (questionId, option) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('vote', { pollId: POLL_ID, answers:responses });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-2xl w-full border border-purple-200">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          {survey.title}
        </h1>
        <p className="text-lg text-center mb-6 text-indigo-700 font-medium">
          {survey.description}
        </p>

        <div>
          {survey.questions.map(question => (
            <div key={question.id} className="mb-6">
              <p className="text-lg font-semibold mb-2 text-indigo-700">{question.text}</p>
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <label key={option} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option}
                      checked={responses[question.id] === index+1}
                      onChange={() => handleOptionChange(question.id, index+1)}
                      className="h-5 w-5 text-pink-500 focus:ring-pink-400"
                    />
                    <span className="text-gray-800 transition duration-150 hover:text-pink-600 hover:scale-110">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition duration-300 transform hover:scale-105"
            onClick={handleSubmit}
          >
            Submit Survey
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueryPage;
