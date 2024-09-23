import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { UseSendFeedback } from '../hook/useFeedback';

const MarkdownResponse = ({ text }) => {
  return (
    <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl">
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
};

const SingleChatPage = () => {
  const location = useLocation();
  const { messages, setMessages, feedbackInput, setFeedbackInput, handleSubmit } = UseSendFeedback();
  const { role, modelResponse } = location.state;

  // Set initial messages using useEffect instead of useState
  useEffect(() => {
    if (role && modelResponse) {
      // Construct the initial messages with user input and model responses
      setMessages([
        { role: 'user', text: role },
        ...modelResponse.map(res => ({ role: 'model', text: res.response })) // Use res.response here
      ]);
    }
  }, [role, modelResponse, setMessages]);
  

  return (
    <div className="chat-container">
      <div className="chat-window">
        <div className="messages">
          {/* Render each message dynamically */}
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <MarkdownResponse text={msg.text} />
            </div>
          ))}
        </div>
        <form className="input-container" onSubmit={handleSubmit}>
          <input
            type="text"
            value={feedbackInput}
            onChange={(e) => setFeedbackInput(e.target.value)}
            placeholder="Type a message..."
            className="input-field"
          />
          <button type="submit" className="send-button">Send</button>
        </form>
      </div>
    </div>
  );
};

export default SingleChatPage;