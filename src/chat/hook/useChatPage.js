import { useEffect, useState } from "react";
import {sendFeedback} from "../service/chatService.js";


const useChat = () => {
    const [hiddenModels, setHiddenModels] = useState(false);
    const [modelResponses, setModelResponses] = useState({});
    const [isLoading, setIsLoading] = useState(true);



    // Function to toggle hide/show for each model
    const toggleHide = (modelName) => {
        setHiddenModels(prev => {
            const updatedHiddenModels = { ...prev };
            if (updatedHiddenModels[modelName]) {
                // Unhide the model by removing it from hiddenModels
                delete updatedHiddenModels[modelName];
            } else {
                // Hide the model by adding it to hiddenModels
                updatedHiddenModels[modelName] = true;
            }
            return updatedHiddenModels;
        });
    };

    const copyResponse = (response) => {
        navigator.clipboard.writeText(response);
        alert("Response copied to clipboard!");
    };

    const getModelBackgroundColor = (name) => {
        switch (name) {
            case 'ChatGpt': return 'lightgreen';
            case 'Gemini': return 'lightblue';
            case 'Claude': return 'lightgrey';
            default: return '#fff';
        }
    };

   

    return {
        hiddenModels,
        setHiddenModels,
        toggleHide,
        copyResponse,
        getModelBackgroundColor,
      
        modelResponses,
        isLoading,
    };
};

export default useChat;
