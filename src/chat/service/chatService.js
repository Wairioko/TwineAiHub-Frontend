import axios from "axios";


export const fetchChatDetails = async (chatId) => {
    try {
        axios.defaults.withCredentials = true;
        const url = `${process.env.REACT_APP_AWS_URL}/api/chat/${chatId}`;
      
        const response = await axios.get(url, { 
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            }, 
            withCredentials: true
            }
        );
        console.log("the response is: " + JSON.stringify(response));
        return response.data;
    } catch (error) {
        console.error('Error fetching chat details:', error);
        throw error;
    }
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

