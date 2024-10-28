import { useEffect, useRef } from 'react';
import useChatStore from '../store/chatStore';
import { SSE_RETRY_DELAY, API_ENDPOINTS } from '../config/constants';

export const useSSE = (chatId) => {
  const eventSourceRef = useRef(null);
  const {
    setChatSession,
    updateModelResponse,
    isOnline,
    addToOfflineQueue
  } = useChatStore();

  useEffect(() => {
    let retryTimeout;

    const connectSSE = () => {
      if (!isOnline || !chatId) return;

      eventSourceRef.current = new EventSource(
        `${API_ENDPOINTS.SSE}/${chatId}`,
        { withCredentials: true }
      );

      eventSourceRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'initial') {
            setChatSession(chatId, data);
          } else if (data.type === 'update') {
            data.modelResponses?.forEach(modelResponse => {
              updateModelResponse(
                chatId,
                modelResponse.modelName,
                modelResponse.responses?.response
              );
            });
          }
        } catch (error) {
          console.error('SSE message processing error:', error);
        }
      };

      eventSourceRef.current.onerror = (error) => {
        console.error('SSE connection error:', error);
        eventSourceRef.current?.close();
        retryTimeout = setTimeout(connectSSE, SSE_RETRY_DELAY);
      };
    };

    connectSSE();

    return () => {
      eventSourceRef.current?.close();
      clearTimeout(retryTimeout);
    };
  }, [chatId, isOnline, setChatSession, updateModelResponse]);

  return eventSourceRef.current;
};