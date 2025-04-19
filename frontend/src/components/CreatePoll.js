import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/createpoll.css'; // Import styles

// Create Poll Component
const CreatePoll = () => {
    const [title, setTitle] = useState(''); // Poll title
    const [description, setDescription] = useState(''); // Poll description
    const [questions, setQuestions] = useState([{ title: '', options: [''] }]); // Initial state: one question, one option
    const [message, setMessage] = useState(''); // Message for feedback
    const [queryLink, setQueryLink] = useState(''); // Form link
    const [resultLink, setResultLink] = useState(''); // Result link
    const navigate = useNavigate(); // Initialize navigate

    // Update question title
    const handleQuestionTitleChange = (index, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].title = value;
        setQuestions(updatedQuestions);
    };

    // Update option content
    const handleOptionChange = (qIndex, oIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options[oIndex] = value;
        setQuestions(updatedQuestions);
    };

    // Add a new option
    const addOption = (qIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options.push(''); // Add an empty option
        setQuestions(updatedQuestions);
    };

    // Remove an option
    const removeOption = (qIndex, oIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.filter((_, i) => i !== oIndex);
        setQuestions(updatedQuestions);
    };

    // Add a new question
    const addQuestion = () => {
        setQuestions([...questions, { title: '', options: [''] }]); // Add an empty question
    };

    // Remove a question
    const removeQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    // Submit the form
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Check if title and description are filled
        if (!title || !description) {
            setMessage('Please enter the poll title and description!');
            return;
        }

        // Check if each question has a title and at least one option
        if (questions.some(q => !q.title || q.options.length === 0)) {
            setMessage('Each question must have a title and at least one option!');
            return;
        }

        // Check if each option has content
        if (questions.some(q => q.options.some(option => !option))) {
            setMessage('Please fill in all options!');
            return;
        }

        try {
            const response = await fetch('http://34.92.76.169:5000/api/createpoll', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, questions }),
            });

            if (response.ok) {
                const responseData = await response.json();
                setMessage('Poll created successfully!');
                setQueryLink(responseData.queryLink); // Set form link
                setResultLink(responseData.resultLink); // Set result link
                setTitle(''); // Reset title
                setDescription(''); // Reset description
                setQuestions([{ title: '', options: [''] }]); // Reset questions and options
            } else {
                const errorData = await response.json();
                setMessage(`Creation failed: ${errorData.error}`);
            }
        } catch (error) {
            setMessage(`Request failed: ${error.message}`);
        }
    };

    return (
          <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 flex items-center justify-center p-4">
            <div className="bg-white/40 p-8 rounded-xl shadow-2xl max-w-3xl w-full border border-purple-200">
    <h1 className="text-3xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
      Create New Poll
    </h1>
    <div className="create-poll-form space-y-6">
      <div>
        <label className="block text-lg font-semibold text-indigo-700 mb-2">Poll Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter poll title"
          className="w-full p-3 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-purple-50 text-gray-800"
        />
      </div>
      <div>
        <label className="block text-lg font-semibold text-indigo-700 mb-2">Poll Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter poll description"
          className="w-full p-3 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-purple-50 text-gray-800 resize-y"
          rows="4"
        />
      </div>
      {questions.map((question, qIndex) => (
        <div key={qIndex} className="question-container bg-purple-50/90 p-6 rounded-lg shadow-md border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <label className="text-lg font-semibold text-indigo-700">Question {qIndex + 1}:</label>
            {questions.length > 1 && (
              <button
                type="button"
                onClick={() => removeQuestion(qIndex)}
                className="bg-pink-600 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition duration-300 transform hover:scale-105"
              >
                Remove Question
              </button>
            )}
          </div>
          <input
            type="text"
            value={question.title}
            onChange={(e) => handleQuestionTitleChange(qIndex, e.target.value)}
            placeholder="Enter question title"
            className="w-full p-3 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-gray-800 mb-4"
          />
          <div>
            <label className="block text-lg font-semibold text-indigo-700 mb-2">Options:</label>
            {question.options.map((option, oIndex) => (
              <div key={oIndex} className="option-container flex items-center space-x-3 mb-3">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                  placeholder={`Option ${oIndex + 1}`}
                  className="flex-1 p-3 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-gray-800"
                />
                {question.options.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeOption(qIndex, oIndex)}
                    className="bg-pink-600 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition duration-300 transform hover:scale-105"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addOption(qIndex)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition duration-300 transform hover:scale-105 mt-2"
            >
              Add Option
            </button>
          </div>
        </div>
      ))}
      <div className="button-group flex space-x-4 justify-center">
        <button
          type="button"
          onClick={addQuestion}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition duration-300 transform hover:scale-105"
        >
          Add Question
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-gradient-to-r from-blue-500 to-purple-700 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-800 transition duration-300 transform hover:scale-105"
        >
          Submit
        </button>
      </div>
      {message && <p className="create-poll-message text-center text-lg font-semibold text-green-700 mt-4">{message}</p>}
      {queryLink && resultLink && (
        <div className="create-poll-links mt-6 bg-purple-50 p-4 rounded-lg shadow-md border border-purple-300">
          <p className="text-center text-indigo-700 font-medium">
            You can fill out the form at this link: <a href={queryLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{queryLink}</a>
          </p>
          <button
            className="result-button bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-3 px-6 rounded-lg shadow-md mt-4 hover:from-purple-700 hover:to-indigo-800 transition duration-200"
            onClick={() => (window.location.href = resultLink)}
          >
            View Results
          </button>
        </div>
      )}
    </div>
  </div >
        </div>
    );
};

export default CreatePoll;
