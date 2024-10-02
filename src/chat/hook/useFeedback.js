import { useState } from "react";
import { sendFeedback } from "../service/chatService.js";

export const UseSendFeedback = () => {
    const [modelName, setModelName] = useState('');
    const [modelFeedback, setModelFeedback] = useState([]);
    const [feedback, setFeedbackInput] = useState('');
    const [chatId, setChatId] = useState('');
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        if (!chatId || !feedback || !modelName) {
          console.error("Missing values:", { chatId, feedback, modelName });
          setError("Please provide all the required values.");
          return;
        }
      
        try {
          // Add user's message to the state first
          const userMessage = { role: 'user', text: feedback };
          setMessages(prevMessages => [...prevMessages, userMessage]);

          // Clear the input field for the user
          setFeedbackInput('');
      
          // Send feedback to the model and wait for the response
          const response = await sendFeedback({ chatId, feedback, modelName });
          
         
          const modelMessage = { role: 'model', modelName, text: response.response }; // Include the response text
          setMessages(prevMessages => [...prevMessages, modelMessage]);
          console.log(messages)
          setModelFeedback(response.response);
        } catch (err) {
          console.error('Error sending feedback:', err);
          setError(err.message);
        }
    };

    return {
        messages, setMessages,
        modelFeedback, setModelFeedback,
        feedback, setFeedbackInput,
        chatId, setChatId,
        modelName, setModelName,
        handleSubmit,
        error
    };
};


