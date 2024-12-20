// components/MessageInput.js
import React, { useState } from 'react';

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    onSendMessage(message);
    setMessage('');
  };

  return (
    <div className="message-input">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ketik pesan Anda di sini..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default MessageInput;
