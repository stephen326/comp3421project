import React, { useState } from 'react';

// 创建投票组件
const CreatePoll = () => {
    // 状态：管理投票的标题、描述、题目和选项
    const [title, setTitle] = useState(''); // 投票标题
    const [description, setDescription] = useState(''); // 投票描述
    const [questions, setQuestions] = useState([{ title: '', options: [''] }]); // 初始状态：一个题目，一个选项
    const [message, setMessage] = useState(''); // 提示信息

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
            //我想看看传过去的json长什么样子
            console.log('请求体:', { title, description, questions });
            console.log('响应:', response);

            if (response.ok) {
                setMessage('投票创建成功！');
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
        <div>
            <h1>创建新投票</h1>
            <form onSubmit={handleSubmit}>
                {/* 投票标题 */}
                <div>
                    <label>投票标题：</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="请输入投票标题"
                    />
                </div>
                {/* 投票描述 */}
                <div>
                    <label>投票描述：</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="请输入投票描述"
                    />
                </div>
                {/* 题目和选项 */}
                {questions.map((question, qIndex) => (
                    <div key={qIndex} style={{ marginBottom: '20px' }}>
                        {/* 题目标题 */}
                        <div>
                            <label>题目 {qIndex + 1}：</label>
                            <input
                                type="text"
                                value={question.title}
                                onChange={(e) => handleQuestionTitleChange(qIndex, e.target.value)}
                                placeholder="请输入题目标题"
                            />
                            {questions.length > 1 && (
                                <button type="button" onClick={() => removeQuestion(qIndex)}>
                                    删除题目
                                </button>
                            )}
                        </div>
                        {/* 选项列表 */}
                        <div>
                            <label>选项：</label>
                            {question.options.map((option, oIndex) => (
                                <div key={oIndex}>
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                        placeholder={`选项 ${oIndex + 1}`}
                                    />
                                    {question.options.length > 1 && (
                                        <button type="button" onClick={() => removeOption(qIndex, oIndex)}>
                                            删除选项
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={() => addOption(qIndex)}>
                                添加选项
                            </button>
                        </div>
                    </div>
                ))}
                {/* 添加题目和提交按钮 */}
                <button type="button" onClick={addQuestion}>
                    添加题目
                </button>
                <button type="submit">提交</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default CreatePoll;