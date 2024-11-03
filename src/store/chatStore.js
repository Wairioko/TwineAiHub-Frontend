import {create} from 'zustand';
import { persist } from 'zustand/middleware';
import { secureStorage } from '../utils/security';
import { API_ENDPOINTS } from '../config/constants';
import api from '../utils/api';

const useChatStore = create(
  persist(
    (set, get) => ({
      chatSessions: {},
      offlineQueue: [],
      isOnline: navigator.onLine,
      
      setChatSession: (chatId, data) => set(state => ({
        chatSessions: {
          ...state.chatSessions,
          [chatId]: {
            ...data,
            lastUpdated: Date.now()
          }
        }
      })),

      updateModelResponse: (chatId, modelName, response) => set(state => {
        const chatSession = state.chatSessions[chatId];
        if (!chatSession) return state;

        const updatedSession = {
          ...chatSession,
          modelResponses: chatSession.modelResponses.map(mr =>
            mr.modelName === modelName
              ? { ...mr, responses: [...mr.responses, response] }
              : mr
          ),
          lastUpdated: Date.now()
        };

        return {
          chatSessions: {
            ...state.chatSessions,
            [chatId]: updatedSession
          }
        };
      }),

      addToOfflineQueue: (action) => set(state => ({
        offlineQueue: [...state.offlineQueue, { ...action, timestamp: Date.now() }]
      })),

      processOfflineQueue: async () => {
        const state = get();
        const queue = [...state.offlineQueue];
        
        for (const action of queue) {
          try {
            // Process each queued action
            await api.post(`${API_ENDPOINTS.CHAT}/${action.chatId}/sync`, action);
            set(state => ({
              offlineQueue: state.offlineQueue.filter(item => item.timestamp !== action.timestamp)
            }));
          } catch (error) {
            console.error('Failed to process offline action:', error);
          }
        }
      },

      setOnlineStatus: (isOnline) => set({ isOnline })
    }),
    {
      name: 'chat-storage',
      getStorage: () => secureStorage
    }
  )
);


export default useChatStore;

