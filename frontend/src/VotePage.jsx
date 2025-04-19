import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://34.150.45.164:5000'); // 根据你的后端端口修改

const POLL_ID = 1; // 假设是第一个问卷
const OPTIONS = [
  { id: 1, text: '苹果' },
  { id: 2, text: '香蕉' },
  { id: 3, text: '橘子' },
];

export default function VotePage() {
    const [results, setResults] = useState([]);
  
    useEffect(() => {
      socket.emit('joinPoll', POLL_ID);
  
      socket.on('updateVotes', (data) => {
        console.log('[📥 前端收到 updateVotes]:', data);
        setResults(data);
      });
  
      return () => socket.off('updateVotes');
    }, []);
  
    const handleVote = (optionId) => {
      socket.emit('vote', { pollId: POLL_ID, optionId });
    };
  
    return (
      <div style={{ padding: '20px' }}>
        <h2>你喜欢哪种水果？</h2>
  
        <div style={{ marginBottom: '20px' }}>
          {results.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleVote(opt.id)}
              style={{ marginRight: '10px' }}
            >
              投 {opt.option_text}
            </button>
          ))}
        </div>
  
        <h3>当前投票结果：</h3>
        {results.map((opt) => (
          <div key={opt.id}>
            {opt.option_text}: {opt.vote_count} 票
          </div>
        ))}
      </div>
    );
  }
  
