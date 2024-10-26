import React from 'react';
import { MarkdownResponse } from './MarkdownResponse';

export const ChatWindow = React.memo(({ modelData }) => {
  if (!modelData) return null;

  return (
    <div className="chat-messages" role="log" aria-live="polite">
      {modelData.responses?.map((response, index) => (
        <div key={index} className="message">
          <MarkdownResponse text={response} />
        </div>
      ))}
    </div>
  );
});