import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate
import '../styles/createpoll.css'; // 引入样式文件 

// Create Poll Component
const CreatePoll = () => {
    const [title, setTitle] = useState(''); // 投票标题
    const [description, setDescription] = useState(''); // 投票描述
    const [questions, setQuestions] = useState([{ title: '', options: [''] }]); // 初始状态：一个题目，一个选项
    const [message, setMessage] = useState(''); // 提示信息
    const [queryLink, setQueryLink] = useState(''); // 填表链接
    const [resultLink, setResultLink] = useState(''); // 结果链接
    const navigate = useNavigate(); // 初始化 navigate

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
            const response = await fetch('http://localhost:5000/api/createpoll', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, questions }),
            });

            if (response.ok) {
                const responseData = await response.json();
                setMessage('投票创建成功！');
                setQueryLink(responseData.queryLink); // 设置填表链接
                setResultLink(responseData.resultLink); // 设置结果链接
                setTitle(''); // 重置标题
                setDescription(''); // 重置描述
                setQuestions([{ title: '', options: [''] }]); // 重置题目和选项
            } else {
                const errorData = await response.json();
                setMessage(`Creation failed: ${errorData.error}`);
            }
        } catch (error) {
            setMessage(`Request failed: ${error.message}`);
        }
    };

    return (
        <div className="create-poll-container">
            <h1 className="create-poll-title">Create New Poll</h1>
            <form onSubmit={handleSubmit} className="create-poll-form">
                <div>
                    <label>Poll Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter poll title"
                    />
                </div>
                <div>
                    <label>Poll Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter poll description"
                    />
                </div>
                {questions.map((question, qIndex) => (
                    <div key={qIndex} className="question-container">
                        <div>
                            <label>Question {qIndex + 1}:</label>
                            <input
                                type="text"
                                value={question.title}
                                onChange={(e) => handleQuestionTitleChange(qIndex, e.target.value)}
                                placeholder="Enter question title"
                            />
                            {questions.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeQuestion(qIndex)}
                                    className="delete-button"
                                >
                                    Remove Question
                                </button>
                            )}
                        </div>
                        <div>
                            <label>Options:</label>
                            {question.options.map((option, oIndex) => (
                                <div key={oIndex} className="option-container">
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                        placeholder={`Option ${oIndex + 1}`}
                                    />
                                    {question.options.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeOption(qIndex, oIndex)}
                                            className="delete-button"
                                        >
                                            Remove Option
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addOption(qIndex)}
                                className="add-option-button"
                            >
                                Add Option
                            </button>
                        </div>
                    </div>
                ))}
                <div className="button-group">
                    <button
                        type="button"
                        onClick={addQuestion}
                        className="add-question-button"
                    >
                        Add Question
                    </button>
                    <button
                        type="submit"
                        className="submit-button"
                    >
                        Submit
                    </button>
                </div>
            </form>
            {message && <p className="create-poll-message">{message}</p>}
            {queryLink && resultLink && (
                <div className="create-poll-links">
                    <p>
                        你可以在这个链接填写表单：<a href={queryLink} target="_blank" rel="noopener noreferrer">{queryLink}</a>
                    </p>
                    <button
                        className="result-button"
                        onClick={() => (window.location.href = resultLink)}
                    >
                        查看结果
                    </button>
                </div>
            )}
        </div>
    );
};

export default CreatePoll;
