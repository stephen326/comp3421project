import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate
import '../styles/createpoll.css'; // 引入样式文件 

// 创建投票组件
const CreatePoll = () => {
    const [title, setTitle] = useState(''); // 投票标题
    const [description, setDescription] = useState(''); // 投票描述
    const [questions, setQuestions] = useState([{ title: '', options: [''] }]); // 初始状态：一个题目，一个选项
    const [message, setMessage] = useState(''); // 提示信息
    const [queryLink, setQueryLink] = useState(''); // 填表链接
    const [resultLink, setResultLink] = useState(''); // 结果链接
    const navigate = useNavigate(); // 初始化 navigate

    // 更新题目标题
    const handleQuestionTitleChange = (index, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].title = value;
        setQuestions(updatedQuestions);
    };

    // 更新选项内容
    const handleOptionChange = (qIndex, oIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options[oIndex] = value;
        setQuestions(updatedQuestions);
    };

    // 添加选项
    const addOption = (qIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options.push(''); // 添加一个空选项
        setQuestions(updatedQuestions);
    };

    // 删除选项
    const removeOption = (qIndex, oIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.filter((_, i) => i !== oIndex);
        setQuestions(updatedQuestions);
    };

    // 添加题目
    const addQuestion = () => {
        setQuestions([...questions, { title: '', options: [''] }]); // 添加一个空题目
    };

    // 删除题目
    const removeQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    // 提交表单
    const handleSubmit = async (e) => {
        e.preventDefault(); // 阻止默认提交行为

        // 检查标题和描述是否填写
        if (!title || !description) {
            setMessage('请填写投票标题和描述！');
            return;
        }

        // 检查每个题目是否有标题和至少一个选项
        if (questions.some(q => !q.title || q.options.length === 0)) {
            setMessage('每个题目必须有标题和至少一个选项！');
            return;
        }

        // 检查每个选项是否有内容
        if (questions.some(q => q.options.some(option => !option))) {
            setMessage('请填写所有选项！');
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
                setMessage(`创建失败: ${errorData.error}`);
            }
        } catch (error) {
            setMessage(`请求失败: ${error.message}`);
        }
    };

    return (
        <div className="create-poll-container">
            <h1 className="create-poll-title">创建新投票</h1>
            <form onSubmit={handleSubmit} className="create-poll-form">
                <div>
                    <label>投票标题：</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="请输入投票标题"
                    />
                </div>
                <div>
                    <label>投票描述：</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="请输入投票描述"
                    />
                </div>
                {questions.map((question, qIndex) => (
                    <div key={qIndex} className="question-container">
                        <div>
                            <label>题目 {qIndex + 1}：</label>
                            <input
                                type="text"
                                value={question.title}
                                onChange={(e) => handleQuestionTitleChange(qIndex, e.target.value)}
                                placeholder="请输入题目标题"
                            />
                            {questions.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeQuestion(qIndex)}
                                    className="delete-button"
                                >
                                    删除题目
                                </button>
                            )}
                        </div>
                        <div>
                            <label>选项：</label>
                            {question.options.map((option, oIndex) => (
                                <div key={oIndex} className="option-container">
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                        placeholder={`选项 ${oIndex + 1}`}
                                    />
                                    {question.options.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeOption(qIndex, oIndex)}
                                            className="delete-button"
                                        >
                                            删除选项
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addOption(qIndex)}
                                className="add-option-button"
                            >
                                添加选项
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
                        添加题目
                    </button>
                    <button
                        type="submit"
                        className="submit-button"
                    >
                        提交
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