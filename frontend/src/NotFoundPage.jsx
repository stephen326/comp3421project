import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-2xl w-full border border-purple-200">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          Poll Not Found
        </h1>
        <p className="text-lg text-gray-700 text-center mb-6">
          The poll you are looking for does not exist or may have been removed.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
