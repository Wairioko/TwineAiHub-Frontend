import { useEffect, useState } from "react";
import ChatService from "../service/chatService";

const useChat = () => {
    const [hiddenModels, setHiddenModels] = useState({});
    const [hideHiddenModels, setHideHiddenModels] = useState(false);
    const [modelResponses, setModelResponses] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setHideHiddenModels(Object.keys(hiddenModels).length === 0);
    }, [hiddenModels]);


    const toggleHide = (modelName) => {
        setHiddenModels(prev => {
            const updatedHiddenModels = { ...prev };
            if (updatedHiddenModels[modelName]) {
                delete updatedHiddenModels[modelName];
            } else {
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

    const handleModelFeedback = async ({ modelName, feedback }) => {
        try {
            const response = await ChatService.submitFeedback({ modelName, feedback });
            // Assuming you want to perform some logic with response
            return response;
        } catch (error) {
            console.error("Error providing feedback:", error);
        }
    };

    return {
        hiddenModels,
        handleModelFeedback,
        toggleHide,
        copyResponse,
        getModelBackgroundColor,
        hideHiddenModels,
        modelResponses,
        isLoading,
    };
};

export default useChat;
