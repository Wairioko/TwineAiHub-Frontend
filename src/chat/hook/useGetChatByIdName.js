import { useCallback, useState } from "react";
import { getChatByIdName } from "../service/chatService";

export const useGetChatIdName = () => {
    const [data, setData] = useState({});
    const [modelName, setModelName] = useState('');
    const [chatId, setChatId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGetChatData = useCallback(async () => {
        // Don't fetch if we don't have both required parameters
        if (!chatId || !modelName) {
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const chatData = await getChatByIdName(chatId, modelName);
            setData(chatData);
            return chatData;
        } catch (error) {
            if(error.status === 409){
                setError("Upgrade account to access this page and many more features");
            }
            console.error('Error fetching chat data:', error.message);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [chatId, modelName]); // Properly memoize based on dependencies

    return { 
        data, 
        setData, 
        modelName,
        setModelName, 
        chatId, 
        setChatId, 
        handleGetChatData,
        isLoading,
        error,
        setError
    };
};

