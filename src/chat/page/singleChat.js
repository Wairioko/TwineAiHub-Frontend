import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  setPendingEdit,
  addMessage,
  applyEditResponse,
  editMessage,
  clearPendingEdit,
  removeMessagesAfterIndex,
  clearMessages,
  initializeMessages
} from '../../store/chatActions';
import { useChatSubmit } from '../hook/useFeedback';
import { ChatMessages } from '../components/ChatMessages';
import { ModelsList } from '../components/ModelsList';
import { useGetChatIdName } from '../hook/useGetChatByIdName';


const SingleChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const allMessages = useSelector((state) => state.messages);
  const currentModelMessages = allMessages[params.name] || [];
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const chatWindowRef = useRef(null);
  const { 
    data, 
    setModelName, 
    setChatId, 
    handleGetChatData,
    isLoading: isFetching,
    error: fetchError 
  } = useGetChatIdName();
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const { error, feedback, setFeedback, handleSubmit, handleEditSubmit } = useChatSubmit(params);

  const handleEditMessage = useCallback((newText, responseId, editIndex) => {
    const modelName = params.name;
    const chatId = params.chatid;
    
    setIsRefreshing(true);
    const originalMessages = [...currentModelMessages];
    
    dispatch(setPendingEdit({ 
      modelName, 
      index: editIndex, 
      originalMessages 
    }));

    dispatch(clearPendingEdit({ 
      modelName, 
      index: editIndex 
    }));
    
    handleEditSubmit(newText, modelName, chatId, responseId)
      .finally(() => {
        setIsRefreshing(false);
      });
  }, [params.name, params.chatid, handleEditSubmit, dispatch, currentModelMessages]);

  useEffect(() => {
    if (params.chatid && params.name) {
      setChatId(params.chatid);
      setModelName(params.name);
    }
  }, [params.chatid, params.name, setChatId, setModelName]);

  useEffect(() => {
    const fetchData = async () => {
      if (params.chatid && params.name) {
        await handleGetChatData();
      }
    };
    fetchData();
  }, [params.chatid, params.name, handleGetChatData]);

  const initializeChat = useCallback((responses) => {
    const modelName = params.name;
    if (!modelName || !responses?.length) return;
  
    const initialMessages = responses.flatMap(({ _id, role, responses }) => {
      if (!responses?.response) return [];
      return [
        { role: 'user', text: role, id: _id }, 
        { role: 'model', text: responses.response }
      ];
    }).filter(Boolean);
  
    if (initialMessages.length > 0) {
      dispatch(initializeMessages({ modelName, messages: initialMessages }));
    }
    setIsLoading(false);
  }, [dispatch, params.name]);

  useEffect(() => {
    let isSubscribed = true;

    const initializeMessagesAsync = async () => {
      const modelName = params.name;
      try {
        if (!isSubscribed || !data?.chat?.modelResponses) return;

        dispatch(clearMessages(modelName));
        setIsLoading(true);
        setIsRefreshing(false);

        const chatData = data.chat.modelResponses;
        const filteredResponses = chatData.filter(
          (response) => response.modelName === params.name
        );

        initializeChat(filteredResponses);
      } catch (error) {
        if (!isSubscribed) return;
        console.error('Error initializing messages:', error);
      } finally {
        if (isSubscribed) setIsLoading(false);
      }
    };

    initializeMessagesAsync();
    return () => {
      isSubscribed = false;
    };
  }, [data?.chat?.modelResponses, params.name, dispatch, initializeChat]);

  const handleModelSelect = useCallback((selectedModel) => {
    const modelName = params.name;
    if (!selectedModel || (selectedModel === params.name && !isRefreshing)) return;

    setIsRefreshing(true);
    dispatch(clearMessages(modelName));

    const selectedModelData = data?.chat?.modelResponses?.find(
      response => response.modelName === selectedModel
    );

    if (selectedModelData) {
      navigate(`/chat/${params.chatid}/${selectedModel}`, {
        state: {
          modelResponses: data?.chat?.modelResponses,
          chatId: params.chatid,
          selectedModel,
          timestamp: Date.now(),
        },
        replace: true,
      });

      setModelName(selectedModel);
      handleGetChatData().then(() => {
        setIsRefreshing(false);
      });
    } else {
      console.error("Selected model data not found");
      setIsRefreshing(false);
    }
  }, [
    data?.chat?.modelResponses,
    navigate,
    params.chatid,
    params.name,
    dispatch,
    isRefreshing,
    setModelName,
    handleGetChatData
  ]);

  const uniqueModels = useMemo(() => {
    if (!data?.chat?.modelResponses) return [];
    
    return data.chat.modelResponses.reduce((acc, current) => {
      if (!acc.find(item => item.modelName === current.modelName)) {
        acc.push({
          modelName: current.modelName
        });
      }
      return acc;
    }, []);
  }, [data?.chat?.modelResponses]);

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(distance) < minSwipeDistance) return;

    if (distance > 0 && currentModelIndex < uniqueModels.length - 1) {
      const nextModel = uniqueModels[currentModelIndex + 1];
      handleModelSelect(nextModel.modelName);
      setCurrentModelIndex(prev => prev + 1);
    }

    if (distance < 0 && currentModelIndex > 0) {
      const prevModel = uniqueModels[currentModelIndex - 1];
      handleModelSelect(prevModel.modelName);
      setCurrentModelIndex(prev => prev - 1);
    }
  };

  return (
    <div className="single-chat-container">
      {/* Sidebar with simplified model cards */}
      <div className="single-sidebar">
        <div className="single-models-list">
          {uniqueModels.map((model) => (
            <div
              key={model.modelName}
              className={`single-model-card ${
                model.modelName === params.name ? 'single-active' : ''
              }`}
              onClick={() => handleModelSelect(model.modelName)}
            >
              {model.modelName}
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="single-models-wrapper">
        <div className="single-model-response-container">
          <div className="single-chat-content">
            {fetchError && (
              <div className="single-error-banner">
                Error : {fetchError}
              </div>
            )}
            
            <ChatMessages
              messages={currentModelMessages}
              modelName={params.name}
              isLoading={isLoading || isFetching}
              isRefreshing={isRefreshing}
              onEditMessage={handleEditMessage}
            />

            <div className="single-input-wrapper">
              <form className="single-input-container" onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Type a message..."
                  className="single-input-field"
                  aria-label="Type a message"
                  disabled={isLoading || isRefreshing}
                />
                <button
                  type="submit"
                  className="single-send-button"
                  disabled={isLoading || isRefreshing}
                >
                  Send
                </button>
              </form>
            </div>
            
            {error && (
              <p className="error-message" role="alert">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Mobile swipe indicators */}
      <div className="single-swipe-indicator">
        {uniqueModels.map((_, index) => (
          <div 
            key={index} 
            className={`single-dot ${index === currentModelIndex ? 'single-active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};


export default React.memo(SingleChatPage);

