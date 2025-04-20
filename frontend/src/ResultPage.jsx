import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Doughnut, Bar, PolarArea } from 'react-chartjs-2';
import { io } from 'socket.io-client';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Chart from 'chart.js/auto';
import 'tailwindcss/tailwind.css';
import { useParams, useNavigate } from "react-router"; // Added useNavigate

ChartJS.register(ArcElement, Tooltip, Legend);

const colorPalette = [
  "#cdb4db",
  "#ffc8dd",
  "#faaac7",
  "#bee2ff",
  "#a2d2ff",
];

// Sample data for questions and results
const questionsData = [
    {
      id: 1,
      text: "How often do you purchase our product?",
      options: ["Daily", "Weekly", "Monthly"]
    },
    {
      id: 2,
      text: "How satisfied are you with our customer service?",
      options: ["Satisfied", "Neutral", "Dissatisfied"]
    },
    {
      id: 3,
      text: "What feature do you value most?",
      options: ["Quality", "Price", "Brand"]
    }
  ];

const resultData = [
  [40, 30, 20],
  [60, 20, 20],
  [50, 30, 15]
];

// const socket = io('http://34.150.45.164:5000'); // 根据你的后端端口修改
const socket = io(`http://${apiHost}:5000`); // 使用环境变量替换硬编码的 IP 地址

const ResultPage = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [data, setData] = useState(resultData);
  const [chartType, setChartType] = useState('Doughnut');
  const [questions, setQuestions] = useState(questionsData);
  const POLL_ID = useParams().pollId;
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    // fetch(`http://34.150.45.164:5000/api/pollresult/${POLL_ID}`)
    fetch(`http://${apiHost}:5000/api/pollresult/${POLL_ID}`) // 使用环境变量替换硬编码的 IP 地址
      .then((response) => {
        if (!response.ok) {
          throw new Error('Poll not found');
        }
        return response.json();
      })
      .then((data) => {
        const updatedData = data.questions.map((question) => {
          return Object.values(question.options).map((option) => option.voteCount);
        });
        setData(updatedData);
        const questions = data.questions.map((question) => ({
          id: question.questionId,
          text: question.questionText,
          options: Object.values(question.options).map((option) => option.optionText)
        }));
        setQuestions(questions);
      })
      .catch((error) => {
        console.error("Error fetching poll data:", error);
        navigate('/not-found'); // Navigate to NotFoundPage
      });

    socket.emit('joinPollRoom', POLL_ID);
    socket.on('updateVotes', (update) => {
      console.log(update);
      setData(update.arrayData);
    });

    return () => socket.off('updateVotes');
  }, []);

  const handleQuestionClick = (index) => {
    setSelectedQuestion(index);
  };

  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  };

  // Predefined chart data
  const chartData = {
    labels: questions[selectedQuestion].options,
    datasets: [
      {
        label: 'Votes',
        data: data[selectedQuestion],
        backgroundColor: colorPalette,
        hoverOffset: 4,
        borderWidth: 1
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#4B0082',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(124, 58, 237, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value =  context.parsed.r || context.parsed.y || context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(2);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const renderChart = () => {
    switch (chartType) {
    case 'Bar':
      return <Bar data={chartData} options={chartOptions} />;
    case 'PolarArea':
      return <PolarArea data={chartData} options={chartOptions} />;
    case 'Doughnut':
    default:
      return <Doughnut data={chartData} options={chartOptions} />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 relative">
      {/* Back to Home Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700 transition duration-300 transform hover:scale-105 m-2"
      >
        Back to Home
      </button>

      {/* Navigation Bar */}
      <div className="w-1/4 bg-gradient-to-b from-indigo-600 to-purple-500 text-white shadow-xl">
        <h2 className="text-2xl font-extrabold p-4 border-b border-indigo-400">Questions</h2>
        <ul>
          {questions.map((question, index) => (
            <li
              key={question.id}
              className={`p-4 cursor-pointer hover:bg-indigo-500 hover:bg-opacity-50 transition duration-200 ${
                selectedQuestion === index ? 'bg-indigo-500 bg-opacity-50' : ''
              }`}
              onClick={() => handleQuestionClick(index)}
            >
              <span className="text-white font-medium">{question.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-pink-900">
          Survey Results
        </h1>
        <div className="max-w-2xl mx-auto bg-white/60 shadow-2xl rounded-xl p-6 border border-purple-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-indigo-700">
              {questions[selectedQuestion].text}
            </h2>
            <select
              value={chartType}
              onChange={handleChartTypeChange}
              className="w-40 p-2.5
              bg-gradient-to-r from-indigo-200 to-purple-300 text-black font-medium
              rounded-lg border border-indigo-300 shadow-sm cursor-pointer
              hover:from-indigo-300 hover:to-purple-400 focus:outline-none"
            >
              <option value="Doughnut">Doughnut</option>
              <option value="Bar">Bar</option>
              <option value="PolarArea">PolarArea</option>
            </select>
          </div>
          {renderChart()}
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
