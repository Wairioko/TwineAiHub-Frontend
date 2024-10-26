import React, { useState } from 'react';
import { MarkdownResponse } from '../../utils/utils';
import { useParams } from 'react-router-dom';

export const ChatMessages = ({ messages, modelName, isLoading, isRefreshing, onEditMessage }) => {
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingMessageResponseId, setEditingMessageResponseId] = useState(null);
  const [editedText, setEditedText] = useState('');
  const { chatId } = useParams();
  

  const LoadingSpinner = () => (
    <div className="loading-spinner-container" role="alert" aria-busy="true">
      <div className="loading-spinner"></div>
      <p>{isLoading ? "Loading chat..." : "Refreshing..."}</p>
    </div>
  );

  const handleEditClick = (index, text, messageId) => {
    setEditingMessageId(index);
    setEditedText(text);
    setEditingMessageResponseId(messageId);
  };

  const handleSaveEdit = (index) => {
    
    onEditMessage(editedText, editingMessageResponseId, chatId, modelName, index);
    setEditingMessageId(null);
    setEditingMessageResponseId(null);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingMessageResponseId(null);
    setEditedText('');
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return messages?.length === 0 ? (
    <p>No messages yet.</p>
  ) : (
    <>
      {isRefreshing && (
        <div className="refresh-overlay" aria-live="polite">
          <LoadingSpinner />
        </div>
      )}
      <div 
        className={`messages-container ${isRefreshing ? 'refreshing' : ''}`}
        role="log"
        aria-live="polite"
      >
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            {editingMessageId === index ? (
              <div className="edit-message-container">
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="edit-message-textarea"
                rows="1" // Start with 1 row
              />
              <div className="edit-message-buttons">
                <button onClick={() => handleSaveEdit(index)}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </div>
            </div>
            
            
            ) : (
              <>
                <MarkdownResponse key={index} text={msg.text} />
                {msg.role === "user" && (
                  <button 
                    onClick={() => handleEditClick(index, msg.text, msg.id)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

