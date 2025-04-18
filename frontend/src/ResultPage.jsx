import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import 'tailwindcss/tailwind.css';

ChartJS.register(ArcElement, Tooltip, Legend);

// Sample data for questions and results
const questions = [
  { id: 1, text: 'Question 1: How satisfied are you with the product?' },
  { id: 2, text: 'Question 2: Would you recommend our service?' },
  { id: 3, text: 'Question 3: How easy was the interface to use?' },
];

const resultData = [
  {
    labels: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'],
    datasets: [
      {
        data: [40, 30, 20, 10],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  },
  {
    labels: ['Yes', 'No', 'Maybe'],
    datasets: [
      {
        data: [60, 20, 20],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  },
  {
    labels: ['Very Easy', 'Easy', 'Moderate', 'Difficult'],
    datasets: [
      {
        data: [50, 30, 15, 5],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  },
];

const ResultPage = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(0);

  const handleQuestionClick = (index) => {
    setSelectedQuestion(index);
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
            data={resultData[selectedQuestion]}
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
