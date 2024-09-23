export const CreateSSEConnection = (chatId, callback) => {
    const eventSource = new EventSource(`http://localhost:4000/api/chat/${chatId}`);

    eventSource.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            console.log('Received data:', data);
            if (typeof callback === 'function') {
                callback(data);
            } else {
                console.error('Callback is not a function');
            }
        } catch (error) {
            console.error('Error parsing SSE data:', error);
        }
    };

    
    eventSource.onerror = (error) => {
        console.error('Error with SSE connection:', error);
    };

    return () => {
        
        eventSource.close();
    };
};


const submitFeedback = async (feedbackData) => {
    try {
        const response = await fetch('http://localhost:4000/api/chat/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(feedbackData),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error in submitFeedback:", error);
        throw error;
    }
};

const ChatService = {
    submitFeedback,
};

export default ChatService;


