import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { io } from 'socket.io-client';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import 'tailwindcss/tailwind.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const colorPalette = [
  "#cdb4db",
  "#ffc8dd",
  "#faaac7",
  "#bee2ff",
  "#a2d2ff",
];

// Sample data for questions and results
const questions = [
    {
      id: 1,
      text: "How often do you purchase our product?",
      options: ["Daily", "Weekly", "Monthly", "Rarely", "Rarely", "Rarely", "Rarely", "Rarely", "Rarely", "Rarely", "Rarely", "Rarely"]
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
  ];

const resultData = [
  [40, 30, 20, 11, 11, 11, 11, 11, 11, 11, 11, 11],
  [60, 20, 20],
  [50, 30, 15, 5]
];

const socket = io('http://localhost:5000'); // 根据你的后端端口修改
const POLL_ID = 1; // 假设是第一个问卷

const ResultPage = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [data, setData] = useState(resultData);

  useEffect(() => {
    // TODO: use api to fech the json

    socket.emit('joinPoll', POLL_ID);
    socket.on('updateVotes', (update) => {
      setData(update);
    });

    return () => socket.off('updateVotes');
  }, []);

  const handleQuestionClick = (index) => {
    setSelectedQuestion(index);
  };

  // 美味的预制data(?)
  const chartData = {
    labels: questions[selectedQuestion].options,
    datasets: [
      {
        data: data[selectedQuestion],
        backgroundColor: colorPalette,
        hoverOffset: 4,
        borderWidth: 1
      },
    ],
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400">
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

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-pink-900">
          Survey Results
        </h1>
        <div className="max-w-2xl mx-auto bg-white/60 shadow-2xl rounded-xl p-6 border border-purple-200">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700">
            {questions[selectedQuestion].text}
          </h2>
          <Doughnut
            data={chartData}
            options={{
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
                      const value = context.parsed || 0;
                      const total = context.dataset.data.reduce((a, b) => a + b, 0);
                      const percentage = ((value / total) * 100).toFixed(2);
                      return `${label}: ${value} (${percentage}%)`;
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
