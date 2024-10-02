import { useEffect, useState } from "react";
import { getChatHistory } from "../service/service";



const useGetHistory = () => {
    const [chats, setChats] = useState([])

    useEffect(() => {
        const fetchHistory = async () => {
            try {
              const history = await getChatHistory();
              console.log("the user", history)
              setChats(history);
             
            } catch (error) {
              console.error("Error fetching chat history:", error);
            }
        };
        fetchHistory();
    }, [])
    

    return {chats, setChats};
}


 
export default useGetHistory;