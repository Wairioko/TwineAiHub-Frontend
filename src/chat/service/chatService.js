import axios from "axios";
export const CreateSSEConnection = (chatId, callback, onClose, onRateLimit) => {
    let connectionClosed = false;
    
    const eventSource = new EventSource(`${process.env.AWS_URL}/api/chat/${chatId}`);
    
    eventSource.onmessage = (event) => {
        if (connectionClosed) return;
        
        try {
            const data = JSON.parse(event.data);
            if (typeof callback === 'function') {
                callback(data);
            } else {
                throw new Error('Callback is not a function');
            }
        } catch (error) {
            console.error('Error parsing SSE data:', error);
            throw error; // Propagate the error
        }
    };
    
    eventSource.addEventListener('close', () => {
        console.log('SSE connection closed by the server.');
        connectionClosed = true;
        eventSource.close();
        if (onClose) onClose();
    });
    
    eventSource.onerror = (error) => {
        if (error.status === 429 || (error.target && error.target.status === 429)) {
            onRateLimit();
            connectionClosed = true;
            eventSource.close();
        } else {
            console.error('Error with SSE connection:', error);
            connectionClosed = true;
            eventSource.close();
            if (onClose) onClose(error); // Pass the error to onClose
        }
    };
    
    return () => {
        connectionClosed = true;
        eventSource.close();
    };
};


export const getChatByIdName = async (chatid, name) => {
    try {
        const response = await axios.get(`${process.env.AWS_URL}/api/chat/${chatid}/${name}`, {
            
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });

        if (!response.ok) {
            switch (response.status) {
                case 403:
                    throw new Error('Access denied');
                case 401:
                    throw new Error('Authentication failed');
                case 409:
                    throw new Error('Please upgrade your account to access more features');
                case 429:
                    throw new Error('Too many requests. Please try again later');
                case 500:
                    throw new Error('Internal Server Error');
                default:
                    throw new Error(`Error fetching chat data (Status: ${response.statusText})`);
            }
        }

        const data = await response.json();
        return data;

    } catch (err) {
        console.log("Failed to fetch chat:", err.message);
        throw err;
    }
};


export const sendFeedback = async (feedbackData) => {
    try {
        const response = await axios.post(`${process.env.AWS_URL}/api/chat/feedback`, {
            
            headers: {
                'Content-Type': 'application/json',
                
            },
            withCredentials: true,
            body: JSON.stringify(feedbackData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        
        return { status: response.status, data: responseData }; // Return status and data properly
    } catch (error) {
        console.error("Error in sendFeedback:", error);
        throw error;
    }
};


export const sendEditMessage = async (editData) => {
    try {
        const response = await axios.put(`${process.env.AWS_URL}/api/chat/edit`, {
            
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token'),
            },
            withCredentials: true,
            body: JSON.stringify(editData),
        });
        console.log("the chat edit data ", editData)
        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('Access denied');
            }
            if (response.status === 401) {
                throw new Error('Authentication failed');
            }
            if(response.status === 409){
                throw new Error("Please upgrade your account to access more features");
            }
            throw new Error(`HTTP error! status: ${response.status}`);

        }
        const responseData = await response.json();
        return { status: response.status, data: responseData }; 
        
    } catch (error) {
        console.error("Error in sendEditMessage:", error);
        throw error;
    }
}



// // API utility functions
// export const fetchChatData = async (chatId) => {
//     try {
//         const response = await fetch(`/api/chats/${chatId}`);
//         if (!response.ok) {
//             throw new Error('Failed to fetch chat data');
//         }
//         return await response.json();
//     } catch (error) {
//         console.error('Error fetching chat data:', error);
//         throw error;
//     }
// };

// export const fetchChatUpdates = async (chatId, lastUpdated) => {
//     try {
//         const response = await fetch(
//             `/api/chats/${chatId}/updates?since=${lastUpdated?.toISOString()}`
//         );
//         if (!response.ok) {
//             throw new Error('Failed to fetch updates');
//         }
//         const data = await response.json();
//         return {
//             hasNewData: data.modelResponses?.length > 0,
//             modelResponses: data.modelResponses || []
//         };
//     } catch (error) {
//         console.error('Error fetching updates:', error);
//         throw error;
//     }
// };

