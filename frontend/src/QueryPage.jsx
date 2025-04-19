import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useParams, useNavigate } from 'react-router-dom'; // 导入 useParams 和 useNavigate

const socket = io('http://localhost:5000'); // 根据你的后端端口修改

// Sample JSON data (in a real app, this would be fetched from a file or API)
const surveyData = {
  title: " ",
  description: " ",
  questions: [
    {
      id: 1,
      text: " ",
      options: [" "]
    },
    {
      id: 2,
      text: " ",
      options: [" "]
    },
    {
      id: 3,
      text: " ",
      options: [" "]
    }
  ]
};

const QueryPage = () => {
  const [survey, setSurvey] = useState(surveyData);
  const [responses, setResponses] = useState({});
  const { pollId } = useParams(); // 获取 URL 中的 pollId 参数
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/pollresult/${pollId}`);
        const data = await response.json();

        if (!data.questions) {
          throw new Error("Invalid poll data");
        }

        const questions = data.questions.map((question) => ({
          id: question.questionId,
          text: question.questionText,
          options: Object.values(question.options).map((option) => option.optionText),
        }));

        setSurvey({
          title: data.title,
          description: data.description,
          questions: questions,
        });
      } catch (error) {
        console.error("Error fetching poll data:", error);
        setSurvey(null); // Set survey to null to indicate an error
        navigate('/not-found'); // Navigate to NotFoundPage
        alert('Not exist!');

      }
    };

    fetchData();
  }, [pollId, navigate]);

  const handleOptionChange = (questionId, option) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 检查是否回答了所有问题
    const allAnswered = survey.questions.every(question => responses[question.id]);
    if (!allAnswered) {
        alert("Please answer all questions before submitting.");
        return;
    }

    socket.emit('vote', { pollId, answers: responses }); // 使用动态 pollId
    navigate(`/thank/${pollId}`); // Navigate to Thank.jsx with pollId
  };

  if (!survey) {
    return <div>Loading...</div>; // 加载中的占位符
  }

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
