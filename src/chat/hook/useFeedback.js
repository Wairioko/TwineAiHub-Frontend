import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import useChatStore from "../../store/chatStore"; 
import { updateMessage, setPendingEdit, addMessage, 
  clearMessages, editMessage, applyEditResponse,
   setModelResponses, clearPendingEdit } from "../../store/chatActions";
import { sendFeedback, sendEditMessage } from '../service/chatService';

export const useChatSubmit = (params) => {
  const dispatch = useDispatch();
  const { chatSessions } = useChatStore(); // Access chatSessions from zustand store
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const currentModel = params.name;

    if (!params.chatid || !feedback.trim()) {
      setError("Please provide feedback.");
      return;
    }

    try {
      setError(null);
      setIsRefreshing(true);

      const userMessage = { role: 'user', text: feedback };
      dispatch(addMessage({ modelName: currentModel, message: userMessage }));
      setFeedback("");

      const response = await sendFeedback({
        chatId: params.chatid,
        feedback,
        modelName: currentModel,
      });

      const modelResponseMessage = { 
        role: 'model', 
        text: response.data.response 
      };
      dispatch(addMessage({ 
        modelName: currentModel,
        message: modelResponseMessage 
      }));

    } catch (err) {
      setError(err.message || "Failed to send feedback. Please try again.");
      
    } finally {
      setIsRefreshing(false);
    }
  }, [feedback, params.chatid, params.name, dispatch]);

  const handleEditSubmit = useCallback(async (newText, modelName, chatId, oldResponse, editIndex) => {
    if (!chatId || !newText) {
      setError("Please provide feedback.");
      return;
    }

    try {
      setError(null);
      setIsRefreshing(true);

      
      // Accessing allMessages from the store
      const currentMessages = chatSessions[chatId]?.modelResponses || [];
      // First, update the message immediately in the UI
      dispatch(editMessage({ 
        modelName, 
        index: editIndex, 
        newText 
      }));

      dispatch(updateMessage({
        modelName,
        index: editIndex,
        newText
      }))

      // Store original messages for potential rollback
      dispatch(setPendingEdit({ 
        modelName, 
        index: editIndex, 
        originalMessages: currentMessages 
      }));

      const response = await sendEditMessage({
        chatId,
        newText,
        modelName,
        oldResponse
      });

      if (response.status === 200) {
        const data = response.data;

        // Apply the edit response
        dispatch(applyEditResponse({
          modelName,
          editedMessage: { role: 'user', text: newText, id: oldResponse, isEdited: true },
          newMessages: [
            {
              role: 'model',
              text: data.updatedResponse.responses.response,
              isNew: true,
            }
          ]
        }));
      } else {
        throw new Error("Failed to edit message");
      }

    } catch (err) {
      console.error('Error editing message:', err);
      setError(err.message || "Failed to edit message. Please try again.");
      // dispatch(clearPendingEdit({ modelName }));
    } finally {
      setIsRefreshing(false);
    }
  }, [dispatch, chatSessions]);

  return {
    error,
    isRefreshing,
    feedback,
    setFeedback,
    handleSubmit,
    handleEditSubmit
  };
};
