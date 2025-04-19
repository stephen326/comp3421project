import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const [pollId, setPollId] = useState('');
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        if (!pollId) {
            alert('Please enter a Poll ID!');
            return;
        }
        navigate(`${path}/${pollId}`);
    };

    return (
        <div className="bg-gradient-to-br from-purple-500 via-pink-400 to-blue-500 min-h-screen flex items-center justify-center p-6">
            <div className="bg-white/80 backdrop-blur-md p-16 rounded-3xl shadow-2xl max-w-4xl w-full">
                <h1 className="text-5xl sm:text-6xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-pink-600 to-blue-600 mb-10 sm:mb-12 leading-tight sm:leading-normal">
                    Welcome to the Voting System
                </h1>
                <p className="text-lg sm:text-xl text-center text-gray-700 font-serif mb-8 sm:mb-10">
                    Please select a feature or enter a Poll ID to query or view results.
                </p>
                <div className="space-y-6 sm:space-y-8">
                    <Link
                        to="/create-poll"
                        className="block text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 sm:py-5 px-8 sm:px-10 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition duration-200 text-lg sm:text-xl font-semibold"
                    >
                        Create Poll
                    </Link>
                    <div className="bg-gradient-to-r from-pink-100 via-pink-200 to-purple-100 p-6 sm:p-8 rounded-lg shadow-md border-4 border-pink-300">
                        <p className="text-lg sm:text-xl text-center text-gray-800 font-serif mb-4 sm:mb-6 font-medium">
                            Enter Poll ID:
                        </p>
                        <input
                            type="text"
                            value={pollId}
                            onChange={(e) => setPollId(e.target.value)}
                            placeholder="Enter Poll ID"
                            className="w-full p-3 sm:p-4 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-gray-800 mb-6 sm:mb-8"
                        />
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                            <button
                                onClick={() => handleNavigate('/query-page')}
                                className="flex-1 bg-gradient-to-r from-indigo-500 to-pink-600 text-white py-3 sm:py-4 rounded-lg shadow-md hover:from-indigo-600 hover:to-pink-700 transition duration-200 text-base sm:text-lg font-semibold"
                            >
                                Query Poll
                            </button>
                            <button
                                onClick={() => handleNavigate('/result-page')}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-700 text-white py-3 sm:py-4 rounded-lg shadow-md hover:from-purple-700 hover:to-blue-800 transition duration-200 text-base sm:text-lg font-semibold"
                            >
                                View Results
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
