import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';


function parseMessageWithCodeBlocks(text) {
  const parts = [];
  const codeRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'code', language: match[1] || '', content: match[2] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return parts;
}

const ChatMessages = ({ messages, modelName, isLoading, isRefreshing }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopyCode = (code, index) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const renderMessageContent = (text, messageIndex) => {
    const parts = parseMessageWithCodeBlocks(text);
    return parts.map((part, index) => {
      if (part.type === 'text') {
        return <span key={index}>{part.content}</span>;
      } else if (part.type === 'code') {
        const codeIndex = `${messageIndex}-${index}`;
        return (
          <div key={codeIndex} className="code-block">
            <SyntaxHighlighter
              language={part.language || 'javascript'}
              style={vscDarkPlus}
            >
              {part.content}
            </SyntaxHighlighter>
            <button
              onClick={() => handleCopyCode(part.content, codeIndex)}
              className="copy-button"
            >
              {copiedIndex === codeIndex ? 'Copied!' : 'Copy'}
            </button>
          </div>
        );
      }
    });
  };

  return (
    <div className="messages-container">
      {messages.map((message, index) => (
        <div key={index} className={`message ${message.role}`}>
          <strong>{message.role === 'user' ? 'You' : modelName}:</strong>
          <div className="message-content">
            {renderMessageContent(message.text, index)}
          </div>
        </div>
      ))}
      {isLoading && <div className="loading">Loading...</div>}
      {isRefreshing && <div className="refreshing">Refreshing...</div>}
    </div>
  );
};

export default ChatMessages;

