import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import 'tailwindcss/tailwind.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const colorPalette = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEEAD",
  "#D4A5A5"
];

// Sample data for questions and results
const questions = [
  { id: 1, text: 'Question 1: How satisfied are you with the product?' },
  { id: 2, text: 'Question 2: Would you recommend our service?' },
  { id: 3, text: 'Question 3: How easy was the interface to use?' },
];

const labelData = [
  ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'],
  ['Yes', 'No', 'Maybe'],
  ['Very Easy', 'Easy', 'Moderate', 'Difficult'],
];

const resultData = [
  [40, 30, 20, 10],
  [60, 20, 20],
  [50, 30, 15, 5]
];

const ResultPage = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const websocket = new WebSocket('ws://127.0.0.1:8080');
    websocket.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      resultData[data.index] = data.data;
    };
    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  const handleQuestionClick = (index) => {
    setSelectedQuestion(index);
  };

  // 美味的预制data(?)
  const chartData = {
    labels: labelData[selectedQuestion],
    datasets: [
      {
        data: resultData[selectedQuestion],
        backgroundColor: colorPalette,
        hoverOffset: 4
      },
    ],
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Navigation Bar */}
      <div className="w-1/4 bg-white shadow-md">
        <h2 className="text-xl font-bold p-4 border-b">Questions</h2>
        <ul>
          {questions.map((question, index) => (
            <li
              key={question.id}
              className={`p-4 cursor-pointer hover:bg-gray-200 ${
                selectedQuestion === index ? 'bg-gray-200' : ''
              }`}
              onClick={() => handleQuestionClick(index)}
            >
              {question.text}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Survey Results</h1>
        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">
            {questions[selectedQuestion].text}
          </h2>
          <Doughnut
            data={chartData}
            options={{
              plugins: {
                legend: {
                  position: 'top',
                },
                tooltip: {
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
