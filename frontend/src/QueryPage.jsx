import React, { useState, useEffect } from 'react';

// Sample JSON data (in a real app, this would be fetched from a file or API)
const surveyData = {
  questions: [
    {
      id: 1,
      text: "How often do you purchase our product?",
      options: ["Daily", "Weekly", "Monthly", "Rarely"]
    },
    {
      id: 2,
      text: "How satisfied are you with our customer service?",
      options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"]
    },
    {
      id: 3,
      text: "What feature do you value most?",
      options: ["Quality", "Price", "Brand", "Support"]
    }
  ]
};

const QueryPage = () => {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});

  // Simulate fetching JSON data
  useEffect(() => {
    // In a real app, replace this with an actual fetch call
    // fetch('/path/to/survey.json')
    //   .then(response => response.json())
    //   .then(data => setQuestions(data.questions));
    setQuestions(surveyData.questions);
  }, []);

  const handleOptionChange = (questionId, option) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Survey Responses:', responses);
    // Handle submission (e.g., send to server)
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Marketing Survey</h1>
        <form onSubmit={handleSubmit}>
          {questions.map(question => (
            <div key={question.id} className="mb-6">
              <p className="text-lg font-semibold mb-2">{question.text}</p>
              <div className="space-y-2">
                {question.options.map(option => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option}
                      checked={responses[question.id] === option}
                      onChange={() => handleOptionChange(question.id, option)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
             Submit Survey
          </button>
        </form>
      </div>
    </div>
  );
};

export default QueryPage;
