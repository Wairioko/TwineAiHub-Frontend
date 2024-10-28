import { DeleteChat } from "../service/service";
import { useState } from "react";


const useDeleteChat = () => {
    const [chatId, setChatId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');


    const handleDeleteChat = async (chatId) => {
        try{
            if(!chatId){
                setError('Chat ID is required')
                return
            }
            setIsLoading(true)
            setError(null)
            window.confirm('Are you sure you want to delete')
            await DeleteChat(chatId)
            
        }catch(e){
            setError(e.message)
            setIsLoading(false)
        }
    }

    return {setChatId, chatId, isLoading, error, handleDeleteChat}
}
 
export default useDeleteChat;