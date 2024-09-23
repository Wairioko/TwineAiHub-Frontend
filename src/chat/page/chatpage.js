import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreateSSEConnection } from '../service/chatService';
import useChat from '../hook/useChatPage';
import ReactMarkdown from 'react-markdown';
import { useSendFeedback } from '../hook/useFeedback';



const MarkdownResponse = ({ text }) => {
    return (
        <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl">
        <ReactMarkdown>{text}</ReactMarkdown>
        </div>
    );
};


const ChatPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [modelResponses, setModelResponses] = useState({});
    const [isProcessingResponses, setIsProcessingResponses] = useState(true); // Flag to control response processing
    const location = useLocation();
    const navigate = useNavigate();
    const { chatId, modelAssignments, problemStatement } = location.state;
    const { toggleHide, copyResponse, getModelBackgroundColor, hiddenModels, handleModelFeedback } = useChat();

    useEffect(() => {
        if (Object.keys(modelResponses).length > 0) {
            setIsLoading(false);
            setIsProcessingResponses(false); // Stop processing responses
        }
    }, [modelResponses]);

    useEffect(() => {
        if (chatId) {
            const cleanup = CreateSSEConnection(chatId, (data) => {
                if (!isProcessingResponses) return; // Ignore further responses if processing is stopped

                console.log('Received data:', data);
                const modelResponsesArray = Array.isArray(data.modelResponses) ? data.modelResponses : [];

                modelResponsesArray.forEach(modelResponse => {
                    const response = modelResponse.responses?.response;
                    if (response) {
                        setModelResponses(prev => ({
                            ...prev,
                            [modelResponse.modelName]: {
                                responses: [
                                    ...(prev[modelResponse.modelName]?.responses || []),
                                    response
                                ],
                                loading: false // Mark as loaded
                            }
                        }));
                    }
                });
            });

            return () => {
                cleanup(); // Ensure cleanup on component unmount
            };
        }
    }, [chatId, isProcessingResponses]); // Add isProcessingResponses as a dependency

    const IndividualModelResponse = ({ modelName, role }) => {
        const modelRes = modelResponses[modelName];
        const responses = modelRes ? modelRes.responses : [];
        const isHidden = hiddenModels[modelName];
        const [showFullRole, setShowFullRole] = useState(false);
    
        console.log(`Model Name: ${modelName}, Responses:`, modelRes);
    
        const handleToggleRole = () => {
            setShowFullRole(prev => !prev);
        };
    
        const getTruncatedRole = (text) => {
            const sentences = text.split('. ');
            if (sentences.length <= 1) return text;
            return sentences.slice(0, 1).join('. ') + '...';
        };
        
        const response = responses.map((response, index) => {
            return response
        });
        return (
            <div
                className={`chat-response ${isHidden ? 'hidden' : ''}`}
                style={{ backgroundColor: getModelBackgroundColor(modelName), borderRadius: '8px', padding: '16px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
            >
                <div className="chat-response-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <button className="copy-button" onClick={() => copyResponse(responses.map(res => res.response).join('\n\n'))}>
                        <i className="fa fa-copy"></i> Copy
                    </button>
                    <label style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{modelName}</label>
                    <div className="chat-response-buttons">
                        {/* passing my model responses and to  */}
                        <button className='enlarge-chat' 
                        onClick={() => {navigate(`/singlechat`, {state:{role:role, 
                            modelResponse:responses.map((response, index) => {
                                return { modelName: modelName, response: response.response }
                            })}}
                            )}}
                        >
                            <i className="fa fa-window-maximize"></i> Chat Window</button>
                        <button onClick={() => toggleHide(modelName)}>
                            {isHidden ? 'Show' : 'Hide'}
                        </button>
                    </div>
                </div>
                {!isHidden && (
                    <>
                        <p style={{ margin: '8px 0', fontStyle: 'italic' }}>
                            Roles Assigned: <MarkdownResponse text={showFullRole ? role : getTruncatedRole(role)} />
                            <button onClick={handleToggleRole} style={{ marginLeft: '8px', cursor: 'pointer' }}>
                                {showFullRole ? 'Show Less' : 'Show More'}
                            </button>
                        </p>
                        <div className="response-area" style={{ marginTop: '12px' }}>
                            {responses.length === 0 ? (
                                <p>No responses available yet.</p>
                            ) : (
                                responses.map((response, index) => (
                                    <div key={index} className="response-item" style={{ padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                                        <MarkdownResponse text={response} />
                                    </div>
                                ))
                            )}
                        </div>
                        <form className="model-feedback" onSubmit={(e) => {
                            e.preventDefault();
                            handleModelFeedback({
                                modelName,
                                feedback: e.target.elements.feedback.value
                            });
                            e.target.elements.feedback.value = ''; // Clear the input after submission
                        }} style={{ marginTop: '12px' }}>
                            <label htmlFor={`feedback-${modelName}`}>Re-run Instructions</label>
                            <input 
                                type="text" 
                                id={`feedback-${modelName}`} 
                                name="feedback" 
                                className="model-feedback-input" 
                                placeholder="Enter your feedback here..." 
                                style={{ width: '100%', padding: '8px', marginTop: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                            <button type="submit" className="submit-feedback" style={{ marginTop: '6px', padding: '8px 12px', borderRadius: '4px', backgroundColor: '#007bff', color: '#fff' }}>
                                Submit
                            </button>
                        </form>
                    </>
                )}
            </div>
        );
    };

    if (isLoading) {
        return <div className="loading">Initializing chat session...</div>;
    }
    
    return (
        <div className="chat-page">
            <div className="problem-statement">
            
                <p>Question: {problemStatement || 'No problem statement available'}</p>
            </div>
            
            <div className="models-container">
                {modelAssignments.map(({ model, role }) => (
                    <IndividualModelResponse key={model} modelName={model} role={role} />
                ))}
            </div>
            
            <button className='summarise-button' onClick={() => {
                console.log('Summarize content');
            }}>
                Summarise Content
            </button>
        </div>
    );
};

export default ChatPage;
