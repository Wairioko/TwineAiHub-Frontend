import { useEffect, useState} from "react";
import { getChatHistory } from "../service/service";

const useGetHistory = (isAuthenticated) => {
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!isAuthenticated) return;

            try {
                const history = await getChatHistory();
                setChats(history);
            } catch (error) {
                console.error("Error fetching chat history:", error);
            }
        };
        
        fetchHistory();
    }, [isAuthenticated]);

    return { chats, setChats };
}

export default useGetHistory;

