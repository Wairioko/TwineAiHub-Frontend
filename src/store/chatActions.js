import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: {},
    modelResponses: {},
    pendingEdits: {},
  },
  reducers: {
    // Basic Chat Message Management
    addMessage: (state, action) => {
      const { modelName, message } = action.payload;
      
      // Initialize messages array if it doesn't exist
      if (!state.messages[modelName]) {
        state.messages[modelName] = [];
      }
      
      // Add new message to the array
      state.messages[modelName].push({
        ...message,
        id: message.id || `msg_${Date.now()}_${state.messages[modelName].length}`
      });
    },
    initializeMessages: (state, action) => {
      const { modelName, messages } = action.payload;
      if (!state.messages[modelName] || state.messages[modelName].length === 0) {
        state.messages[modelName] = messages;
      }
    },
    editMessage: (state, action) => {
      const { modelName, index, newText } = action.payload;
      if (state.messages[modelName] && state.messages[modelName][index]) {
        state.messages[modelName][index] = { ...state.messages[modelName][index],
          text: newText,
          isEdited: true };
        state.messages[modelName].length = index + 1;
      }
    },
    setPendingEdit: (state, action) => {
      const { modelName, index, originalMessages } = action.payload;
      state.pendingEdits[modelName] = { index, originalMessages };
    },
    clearPendingEdit: (state, action) => {
      const { modelName } = action.payload;
      delete state.pendingEdits[modelName];
    },
    applyEditResponse: (state, action) => {
      const { modelName, editedMessage, newMessages } = action.payload;
      if (state.pendingEdits[modelName]) {
        const { index } = state.pendingEdits[modelName];
        state.messages[modelName] = [
          ...state.messages[modelName].slice(0, index),
          {editedMessage, isEdited: true },
          ...newMessages
        ];
        delete state.pendingEdits[modelName];
      }
    },
    removeMessagesAfterIndex: (state, action) => {
      const { modelName, index } = action.payload;
      if (state.messages[modelName]) {
        state.messages[modelName] = state.messages[modelName].slice(0, index + 1);
      }
    },
    clearMessages: (state, action) => {
      const { modelName } = action.payload;
      if (modelName) {
        state.messages[modelName] = [];
      } else {
        state.messages = {};
      }
    },

    // Advanced Features for Handling Model Responses and Edits
    setModelResponses: (state, action) => {
      const { modelName, responses } = action.payload;
      state.modelResponses[modelName] = responses;
    },
    updateMessage: (state, action) => {
      const { modelName, index, newText } = action.payload;
      if (state.messages[modelName] && state.messages[modelName][index]) {
        state.messages[modelName][index] = { ...state.messages[modelName][index], text: newText };
      }
    },
    setPendingEdit: (state, action) => {
      const { modelName, index, originalMessages } = action.payload;
      state.pendingEdits[modelName] = { index, originalMessages };
    },
    clearPendingEdit: (state, action) => {
      const { modelName } = action.payload;
      delete state.pendingEdits[modelName];
    },
    applyEditResponse: (state, action) => {
      const { modelName, editedMessage, newMessages } = action.payload;
      if (state.pendingEdits[modelName]) {
        const { index } = state.pendingEdits[modelName];
        // Replace the edited message and append new messages (if any)
        state.messages[modelName] = [
          ...state.messages[modelName].slice(0, index),
          editedMessage,
          ...newMessages // New messages should be appended after the edited message
        ];
        delete state.pendingEdits[modelName]; // Clear pending edit
      }
    },
    
  },
});

export const {
  addMessage,
  initializeMessages,
  editMessage,
  removeMessagesAfterIndex,
  clearMessages,
  setModelResponses,
  updateMessage,
  setPendingEdit,
  clearPendingEdit,
  applyEditResponse
} = chatSlice.actions;

export default chatSlice.reducer;
