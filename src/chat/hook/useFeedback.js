import { useState } from "react";
import sendFeedback from  "../service/chatService"


export const UseSendFeedback = () => {
    const [modelName, setmodelName] = useState('');
    const [modelFeedback, setModelFeedback]= useState([])
    const [feedbackInput, setFeedbackInput] = useState('');
    const [chatId, setChatId] = useState('');
    const [messages, setMessages] = useState([]);


    const handleSubmitFeedback = async () => {{
        const data = {
            chatId,feedbackInput, modelName
        }
        try{
            const response = await sendFeedback(data)
            if(response.status === 200){
                setModelFeedback(response.data)
                return response.data;
            }else{
                throw new Error("Failed to send feedback")
            }
        }catch(e){
            throw e;
        }
    }}    

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Create a new message entry for the user input
        const userMessage = { role: 'user', text: feedbackInput };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        
        // Reset user input field
        setFeedbackInput('');
    
        // Send feedback to the AI model and get the response
        try {
          const modelFeedback = await handleSubmitFeedback();
          const modelMessage = { role: modelName, text: modelFeedback };
          setMessages(prevMessages => [...prevMessages, modelMessage]);
        } catch (err) {
          console.error('Error sending feedback:', err);
        }
    };


    return {messages, setMessages,
        modelFeedback, setModelFeedback, feedbackInput, setFeedbackInput,
        setChatId,handleSubmitFeedback, modelName, setmodelName, handleSubmit
    }


}

