import React from 'react';

function CreateSurvey() {
    const createPoll = async () => {
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const optionGroups = document.querySelectorAll('.option-group');
        const questions = [];

        optionGroups.forEach(group => {
            const questionText = group.querySelector('.question').value;
            const options = Array.from(group.querySelectorAll('input:not(.question)')).map(input => input.value);

            if (!questionText.trim() || options.some(option => option.trim() === '')) {
                alert('Please fill in all the questions and options!');
                return;
            }

            questions.push({ question: questionText, options });
        });

        const dataToSend = { title, description, questions };
        console.log('Data to be sent:', JSON.stringify(dataToSend, null, 2)); // Log the data for testing

        const response = await fetch('http://localhost:3000/createPoll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        });

        const result = await response.json();
        if (response.ok) {
            alert('Poll created successfully!');
        } else {
            alert(`Error: ${result.message}`);
        }
    };

    const addQuestionGroup = () => {
        const container = document.getElementById('options-container');
        const group = document.createElement('div');
        group.className = 'option-group';
        group.innerHTML = `
                <div>
                    <label>Question:</label>
                    <input type="text" class="question" required>
                </div>
                <div>
                    <label>Option 1:</label>
                    <input type="text" required>
                </div>
                <div>
                    <label>Option 2:</label>
                    <input type="text" required>
                </div>
                <div>
                    <label>Option 3:</label>
                    <input type="text" required>
                </div>
                <div>
                    <label>Option 4:</label>
                    <input type="text" required>
                </div>
                <button type="button" onclick="removeQuestionGroup(this)">❌ Remove Question</button>
            `;
        container.appendChild(group);
    };

    const removeQuestionGroup = (button) => {
        const group = button.parentElement;
        group.remove();
    };

    return (
        <div>
            <h1>Create Poll</h1>
            <form onSubmit={(e) => { e.preventDefault(); createPoll(); }}>
                <div>
                    <label htmlFor="title">Poll Title:</label>
                    <input type="text" id="title" required />
                </div>
                <div>
                    <label htmlFor="description">Poll Description:</label>
                    <textarea id="description" required></textarea>
                </div>
                <div id="options-container">
                    <div className="option-group">
                        <div>
                            <label>Question:</label>
                            <input type="text" className="question" required />
                        </div>
                        <div>
                            <label>Option 1:</label>
                            <input type="text" required />
                        </div>
                        <div>
                            <label>Option 2:</label>
                            <input type="text" required />
                        </div>
                        <div>
                            <label>Option 3:</label>
                            <input type="text" required />
                        </div>
                        <div>
                            <label>Option 4:</label>
                            <input type="text" required />
                        </div>
                        <button type="button" onClick={(e) => removeQuestionGroup(e.target)}>❌ Remove Question</button>
                    </div>
                </div>
                <button type="button" onClick={addQuestionGroup}>➕ Add Question</button>
                <button type="submit">✅ Create Poll</button>
            </form>
        </div>
    );
}

export default CreateSurvey;
