import axios from "axios";

export const CreateWebSocketConnection = (chatId, callback, onClose, onRateLimit) => {
    if (!chatId) {
        console.error('ChatId is required');
        return () => {};
    }

    let ws = null;
    let reconnectAttempts = 0;
    const MAX_RECONNECT_ATTEMPTS = 5;
    const INITIAL_RECONNECT_DELAY = 1000;
    let connectionClosed = false;

    const cleanup = () => {
        connectionClosed = true;
        if (ws) {
            ws.close();
            ws = null;
        }
    };

    const handleReconnection = () => {
        if (connectionClosed || reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
            console.log('Max reconnection attempts reached or connection closed');
            cleanup();
            if (onClose) onClose();
            return;
        }

        reconnectAttempts++;
        const delay = Math.min(
            INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttempts - 1),
            30000
        );

        console.log(`Attempting reconnection ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} in ${delay}ms`);
        
        setTimeout(() => {
            if (!connectionClosed) {
                initializeConnection();
            }
        }, delay);
    };

    const initializeConnection = () => {
        if (connectionClosed) return;

        const wsUrl = `${process.env.REACT_APP_WS_URL}/api/chat/${chatId}`;
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('WebSocket connected');
            reconnectAttempts = 0;
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'update' && typeof callback === 'function') {
                    callback(data.data);
                } else if (data.type === 'error') {
                    console.error('Server error:', data.message);
                }
            } catch (error) {
                console.error('Error parsing WebSocket data:', error);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            if (error.code === 429) {
                cleanup();
                if (typeof onRateLimit === 'function') {
                    onRateLimit();
                }
                return;
            }
        };

        ws.onclose = (event) => {
            if (!connectionClosed) {
                if (event.code === 1008) {
                    console.error('WebSocket closed due to authentication error');
                    cleanup();
                    if (onClose) onClose();
                } else {
                    handleReconnection();
                }
            }
        };
    };

    initializeConnection();
    return cleanup;
};


export const getChatByIdName = async (chatid, name) => {
    try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${process.env.REACT_APP_AWS_URL}/api/chat/${chatid}/${name}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            withCredentials: true
        });

        // Extract the response body
        const parsedBody = JSON.parse(response.data.body);

        // Return the parsed body data
        return parsedBody;
        // const data = response.json
        // return data

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
        axios.defaults.withCredentials = true;
        const response = await axios.post(`${process.env.REACT_APP_AWS_URL}/api/chat/feedback`, 
            feedbackData, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    
                    
                },
                withCredentials: true
            }
        );
        // Extract the response body
        const parsedBody = JSON.parse(response.data.body);

        // Return the parsed body data
        return parsedBody; 
    //     const data = response.json
    // return data
    } catch (error) {
        console.error("Error in sendFeedback:", error);
        throw error;
    }
};



export const sendEditMessage = async (editData) => {
    try {
        axios.defaults.withCredentials = true;
        const response = await axios.put(
            `${process.env.REACT_APP_AWS_URL}/api/chat/edit`,
            editData, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                withCredentials: true,
            }
        );

        // Extract the response body
        const parsedBody = JSON.parse(response.data.body);

        // Return the parsed body data
        return parsedBody;
    //     const data = response.json
    // return data

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

