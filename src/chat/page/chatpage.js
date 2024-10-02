import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreateSSEConnection } from '../service/chatService';
import useChat from '../hook/useChatPage';
import { MarkdownResponse } from '../../utils/utils';





const ChatPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [modelResponses, setModelResponses] = useState({});
    const [isProcessingResponses, setIsProcessingResponses] = useState(true); // Flag to control response processing
    const location = useLocation();
    const navigate = useNavigate();
    const { chatId, modelAssignments, problemStatement } = location.state;
    console.log("my data from state",chatId, modelAssignments, problemStatement, modelResponses)
    const { toggleHide, copyResponse, getModelBackgroundColor, hiddenModels, setHiddenModels } = useChat();
    
    
    useEffect(() => {
        if (Object.keys(modelResponses).length > 0) {
            setIsLoading(false);
            setIsProcessingResponses(false); // Stop processing responses
        }
    }, [modelResponses]);

    useEffect(() => {
        if (chatId) {
            if (!isProcessingResponses) return; 
            
            const cleanup = CreateSSEConnection(chatId, (data) => {
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
                                loading: false
                            }
                        }));
                    }
                });
            });
    
            return cleanup; 
        }
    }, [chatId, isProcessingResponses]);
    

    

    const IndividualModelResponse = React.memo(({ modelName, role }) => {
        const modelRes = modelResponses[modelName];
        const responses = modelRes ? modelRes.responses : [];
        const isHidden = hiddenModels[modelName];
        const [showFullRole, setShowFullRole] = useState(false);
    
        const handleToggleRole = () => {
            setShowFullRole(prev => !prev);
        };
    
        const getTruncatedRole = (text) => {
            const sentences = text.split(':');
            if (sentences.length <= 2) return text;
            return sentences.slice(0, 2).join('. ') + '...';
        };
    
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
                        <button className='enlarge-chat' onClick={() => {
                            
                            navigate(`/chat/${chatId}/${modelName}`, {
                                state: {
                                    role: role,
                                    problemStatement,
                                    responses,
                                    modelAssignments,
                                    chatId,
                                    modelResponses,
                                    modelName
                                },
                            });
                        }}>
                            <i className="fa fa-window-maximize"></i> Chat Window
                        </button>
                        <button onClick={() => toggleHide(modelName)}>
                            {isHidden ? 'Show' : 'Hide'}
                        </button>
                    </div>
                </div>
                {!isHidden && (
                    <>
                        <div style={{ margin: '8px 0', fontStyle: 'italic' }}>
                            Roles Assigned: <MarkdownResponse text={showFullRole ? role : getTruncatedRole(role)} />
                            <button onClick={handleToggleRole} style={{ marginLeft: '8px', cursor: 'pointer' }}>
                                {showFullRole ? 'Show Less' : 'Show More'}
                            </button>
                        </div>
                        <div className="response-area" style={{ marginTop: '12px' }}>
                            {responses.length === 0 ? (
                                <div>No responses available yet.</div>
                            ) : (
                                responses.map((response, index) => (
                                    <div key={index} className="response-item" style={{ padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                                        <MarkdownResponse text={response} />
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>
        );
    });
    

    if (isLoading) {
        return <div className="loading">Initializing chat session...</div>;
    }
    
    return (
        <div className="chat-page">
            <div className="problem-statement">
            
                <p>Question: {problemStatement || 'No problem statement available'}</p>
            </div>
            {Object.keys(hiddenModels).length > 0 && (
            <div className='hidden-responses'>
                <h3>Hidden Responses</h3>
                <ul>
                    {Object.keys(hiddenModels).map(modelName => (
                        <li key={modelName}>{modelName}</li>
                    ))}
                </ul>

                <button
                    className='show-all-responses'
                    onClick={() => {
                        setHiddenModels({});
                    }}
                >
                    Show All Responses
                </button>
                    </div>
            )}

            <div className="models-container">
                {modelAssignments.map(({ model, role }, idx) => (
                    <IndividualModelResponse key={model || idx} modelName={model} role={role} />
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
