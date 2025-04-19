import React from 'react';

const Thank = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-2xl w-full border border-purple-200">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          Thank You!
        </h1>
        <p className="text-lg text-gray-700 text-center">We appreciate your support.</p>
      </div>
    </div>
  );
};

export default Thank;
