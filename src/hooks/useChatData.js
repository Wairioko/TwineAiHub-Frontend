import { useState, useEffect } from 'react';
import api from '../utils/api';
import useChatStore from '../store/chatStore';
import { CACHE_DURATION } from '../config/constants';

export const useChatData = (chatId) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const chatSession = useChatStore(state => state.chatSessions[chatId]);
  const setChatSession = useChatStore(state => state.setChatSession);
  const isOnline = useChatStore(state => state.isOnline);

  useEffect(() => {
    const fetchData = async () => {
      if (!chatId) return;

      const now = Date.now();
      const isCacheValid = chatSession?.lastUpdated && 
        (now - chatSession.lastUpdated) < CACHE_DURATION;

      if (chatSession && isCacheValid) {
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const response = await api.get(`${API_ENDPOINTS.CHAT}/${chatId}`);
        setChatSession(chatId, response.data);
      } catch (error) {
        setError(error.message);
        // Use cached data if available and offline
        if (!isOnline && chatSession) {
          setError('Using cached data (offline mode)');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [chatId, chatSession, setChatSession, isOnline]);

  return { chatSession, loading, error };
};

