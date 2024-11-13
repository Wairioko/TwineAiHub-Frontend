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
                console.warn('Callback is not a function');
            }
        } catch (error) {
            console.error('Error parsing SSE data:', error);
        }
    };
    
    eventSource.addEventListener('close', () => {
        console.log('SSE connection closed by the server.');
        connectionClosed = true;
        eventSource.close();
        if (typeof onClose === 'function') onClose();
    });
    
    eventSource.onerror = (error) => {
        const status = error.status || (error.target && error.target.status);

        if (status === 429) {
            if (typeof onRateLimit === 'function') onRateLimit();
            connectionClosed = true;
            eventSource.close();
        } else {
            console.error('Error with SSE connection:', error);
            connectionClosed = true;
            eventSource.close();
            if (typeof onClose === 'function') onClose(error);
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

        return response.data;

    } catch (error) {
        // Handle specific error statuses
        if (error.response) {
            switch (error.response.status) {
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
                    throw new Error(`Error fetching chat data (Status: ${error.response.statusText || error.message})`);
            }
        } else {
            console.log("Failed to fetch chat:", error.message);
            throw new Error('Network error or server unavailable');
        }
    }
};


export const sendFeedback = async (feedbackData) => {
    try {
        const response = await axios.post(`${process.env.AWS_URL}/api/chat/feedback`, 
            feedbackData, 
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            }
        );
        const data = response.data;

        return data 
    } catch (error) {
        console.error("Error in sendFeedback:", error);
        throw error;
    }
};



export const sendEditMessage = async (editData) => {
    try {
        const response = await axios.put(
            `${process.env.AWS_URL}/api/chat/edit`,
            editData, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
                withCredentials: true,
            }
        );

        const responseData = response.data; 
        return responseData

    } catch (error) {
        if (error.response) {
            switch (error.response.status) {
                case 403:
                    throw new Error('Access denied');
                case 401:
                    throw new Error('Authentication failed');
                case 409:
                    throw new Error('Please upgrade your account to access more features');
                default:
                    throw new Error(`HTTP error! status: ${error.response.status}`);
            }
        } else {
            console.error("Network or server error in sendEditMessage:", error);
            throw error;
        }
    }
};



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

