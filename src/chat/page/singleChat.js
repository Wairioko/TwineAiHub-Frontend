import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useParams} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage, setModelResponses, clearMessages, initializeMessages } from '../../store/chatActions';
import { sendFeedback } from '../service/chatService';
import { MarkdownResponse } from '../../utils/utils';


const SingleChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const allMessages = useSelector((state) => state.messages);
  const currentModelMessages = allMessages[params.name] || [];
  const [feedback, setFeedbackInput] = useState("");
  const [error, setError] = useState(null);

  const initializeChat = useCallback((role, modelResponse, modelName) => {
    if (role && modelResponse.length > 0 && !allMessages[modelName]?.length) {
      const initialMessages = [
        { role: 'user', text: role },
        ...modelResponse.map(res => ({
          role: 'model',
          text: res,
        })),
      ];
      dispatch(initializeMessages({ modelName, messages: initialMessages }));
    }
  }, [dispatch, allMessages]);

  
  useEffect(() => {
    const chatId = location.state?.chatId; // Ensure you access chatId correctly
    const { role, modelResponses = {} } = location.state || {};
    const modelResponse = modelResponses[params.name]?.responses || [];
    
    if (chatId) {
      initializeChat(role, modelResponse, params.name);
    }

    return () => {
      dispatch(clearMessages());
    };
  }, [params.name, initializeChat, location.state, dispatch]);
  const chatId = params.chatid;

  const handleCardClick = useCallback((modelName) => {
    localStorage.removeItem('persist:root')
    const assignedRole = location.state?.modelAssignments?.flatMap(nestedArray => nestedArray)
      ?.find(item => item.model === modelName)?.role;

    navigate(`/chat/${chatId}/${modelName}`, {
      state: {
        modelResponses: location.state?.modelResponses,
        modelAssignments: location.state?.modelAssignments,
        chatId: location.state?.chatId,
        role: assignedRole,
      },
      replace: true,
    });
  }, [navigate, location.state, chatId]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const currentModel = params.name;

    if (!params.chatid|| !feedback.trim()) {
      setError("Please provide feedback.");
      return;
    }

    try {
      const userMessage = { role: 'user', text: feedback };
      dispatch(addMessage({ modelName: currentModel, message: userMessage }));

      setFeedbackInput("");

      const response = await sendFeedback({ 
        chatId: params.chatid, 
        feedback, 
        modelName: currentModel 
      });

      const modelResponseMessage = { role: 'model', text: response.data.response };
      dispatch(addMessage({ modelName: currentModel, message: modelResponseMessage }));

      setError(null);
    } catch (err) {
      console.error("Error sending feedback:", err);
      setError("Failed to send feedback.");
    }
  }, [feedback, params.chatid, params.name, dispatch]);

  const memoizedModelsList = useMemo(() => (
    <div className="models-list">
      <h3>Models</h3>
      {location.state?.modelAssignments?.flatMap(nestedArray => nestedArray).map(({ model, role }) => (
        <div
          key={model}
          className="model-card"
          onClick={() => handleCardClick(model)}
        >
          <h4 className="model-name">{model}</h4>
        </div>
      ))}
    </div>
  ), [location.state?.modelAssignments, handleCardClick]);

  const messageElements = useMemo(() => {
    return currentModelMessages?.length === 0 ? (
      <p>No messages yet.</p>
    ) : (
      currentModelMessages.map((msg, index) => (
        <div key={index} className={`message ${msg.role}`}>
          {msg.role === "model" ? <strong>Model:</strong> : <strong>User:</strong>}
          <MarkdownResponse text={msg.text} />
        </div>
      ))
    );
  }, [currentModelMessages]);
  
  return (
    <div className="chat-container">
      {memoizedModelsList}
      <div className="chat-window">
        <div className="messages">
          {messageElements}
        </div>
        <form className="input-container" onSubmit={handleSubmit}>
          <input
            type="text"
            value={feedback}
            onChange={(e) => setFeedbackInput(e.target.value)}
            placeholder="Type a message..."
            className="input-field"
            aria-label="Type a message"
          />
          <button type="submit" className="send-button">Send</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default React.memo(SingleChatPage);