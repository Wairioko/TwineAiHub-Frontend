import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchChatDetails } from '../service/chatService';
import useChat from '../hook/useChatPage';
import { MarkdownResponse } from '../../utils/utils';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { HiddenResponsesPanel } from '../components/HiddenResponsesPanel';


// Navigation utility
const handleNavigateToChat = (navigate, chatId, modelName) => {
    navigate(`/chat/${chatId}/${modelName}`, { 
        state: { chatId, modelName } 
    });
};

// Helper function to create a unique ID for each response
const createResponseId = (response, index) => {
    if (typeof response === 'string') return `${response}-${index}`;
    if (response?.response) return `${response.response}-${index}`;
    return `${JSON.stringify(response)}-${index}`;
};

const IndividualModelResponse = React.memo(({ 
    modelName, 
    role, 
    responses,
    isHidden,
    onNavigate,
    onToggleHide,
    onCopy,
    getModelBackgroundColor,
    isLoading,
    dataInitialized,
}) => {
    const [showFullRole, setShowFullRole] = useState(false);
    
    const handleToggleRole = useCallback(() => {
        setShowFullRole(prev => !prev);
    }, []);

    const getTruncatedRole = useCallback((role) => {
        if (!role) return '';
        const sentences = role.split(/[: ,]/);
        if (sentences.length <= 20) return role;   
        return sentences.slice(0, 15).join(' ') + '...';
    }, []);

    return (
        <div
            className={`chat-response ${isHidden ? 'hidden' : ''}`}
            style={{ 
                backgroundColor: getModelBackgroundColor(modelName), 
                borderRadius: '8px', 
                padding: '16px', 
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                marginBottom: '16px'
            }}
        >
            <div className="chat-response-header">
                <button
                    className="copy-button"
                    onClick={onCopy}
                    disabled={isLoading}
                    style={{
                        cursor: !isLoading ? 'pointer' : 'not-allowed',
                    }}
                >
                    <i className="fa fa-copy"></i> Copy
                </button>
                <label style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{modelName}</label>
                <div className="chat-response-buttons">
                    <button
                        className='enlarge-chat'
                        onClick={onNavigate}
                        disabled={isLoading}
                        style={{
                            cursor: !isLoading ? 'pointer' : 'not-allowed'
                        }}
                    >
                        <i className="fa fa-window-maximize"></i> Chat Window
                    </button>
                    <button
                        onClick={onToggleHide}
                        disabled={isLoading}
                        style={{
                            cursor: !isLoading ? 'pointer' : 'not-allowed'
                        }}
                    >
                        {isHidden ? 'Show' : 'Hide'}
                    </button>
                </div>
            </div>
            {!isHidden && (
                <>
                    <div style={{ margin: '8px 0', fontStyle: 'italic' }}>
                        Roles Assigned: {showFullRole ? role : getTruncatedRole(role)}
                        <button
                            onClick={handleToggleRole}
                            disabled={isLoading}
                        >
                            {showFullRole ? 'Show Less' : 'Show More'}
                        </button>
                    </div>
                    <div className="response-item">
                        {isLoading ? (
                            <LoadingSpinner message="Loading response..." />
                        ) : (
                            responses.map((response, index) => (
                                <div key={createResponseId(response, index)} className={index === 0 ? 'primary-response' : 'additional-response'}>
                                    <strong>{index === 0 ? 'Primary Response:' : `Response ${index + 1}:`}</strong>
                                    <MarkdownResponse text={response?.response || response} />
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
});

IndividualModelResponse.displayName = 'IndividualModelResponse';

const RefreshOverlay = () => (
    <div className="refresh-overlay">
        <LoadingSpinner message="Refreshing data..." />
    </div>
);

const getUniqueModels = (modelResponses) => {
    const uniqueModels = new Map();  // Use Map to store unique models

    modelResponses.forEach((modelResponse) => {
        const { modelName, responses } = modelResponse;

        if (!uniqueModels.has(modelName)) {
            // If the model is not yet added, add it
            uniqueModels.set(modelName, { ...modelResponse });
        } else {
            // If the model is already added, choose to keep the latest or merge responses if necessary
            const existingModel = uniqueModels.get(modelName);
            uniqueModels.set(modelName, {
                ...existingModel,
                responses: [...existingModel.responses, ...responses]  // Combine responses
            });
        }
    });

    // Convert Map values back to an array
    return Array.from(uniqueModels.values());
};



const ChatPage = ({ handleRateLimitError }) => {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { modelAssignments } = location.state || {};
    const [problemStatement, setProblemStatement] = useState('');
    const { toggleHide, copyResponse, getModelBackgroundColor, hiddenModels, setHiddenModels } = useChat();
    const chatId = params.chatid;
    const previousChatIdRef = useRef(chatId);
    const [error, setError] = useState(null);
    
    const [pageState, setPageState] = useState({
        isInitialLoading: true,
        isRefreshing: false,
        error: null,
        lastUpdated: null
    });

    const getErrorMessage = (error) => {
        console.log("this is the error message", error);
        if (!error) return null;
        if (typeof error === 'string') return error;
        if (error.message) return error.message;
        if (error.status === 429) return 'Rate limit exceeded. Please try again later.';
        return 'An error occurred. Please try again.';
    };

    // Fixed modelResponses state initialization
    const [modelResponses, setModelResponses] = useState({
        data: [],
        loadingStates: {}
    });

    const maxResponsesToShow = 2;

    useEffect(() => {
        setProblemStatement(location.state?.problemStatement || '');
    }, [location.state]);

    useEffect(() => {
        if (modelAssignments && Array.isArray(modelAssignments)) {
            const initialModelData = modelAssignments.map(({ model, role }) => ({
                modelName: model,
                role,
                responses: [],
                loading: true
            }));

            setModelResponses({
                data: initialModelData,
                loadingStates: initialModelData.reduce((acc, { modelName }) => ({
                    ...acc,
                    [modelName]: true
                }), {})
            });

            setPageState(prev => ({ ...prev, isInitialLoading: false }));
        }
    }, [modelAssignments]);

    const normalizeResponses = useCallback((responses) => {
        if (!responses) return [];
        if (typeof responses === 'string') return [{ response: responses }];
        if (!Array.isArray(responses)) return [responses];
        return responses.map(r => typeof r === 'string' ? { response: r } : r);
    }, []);

    const updateChatDetails = useCallback(async () => {
        try {
            const data = await fetchChatDetails(chatId);

            if (data && data.modelResponses && data.modelResponses.length > 0) {
                setProblemStatement(data.userProblemBreakdown.problemStatement.description);

                setModelResponses(prev => {
                    // Create a new array based on existing data
                    const currentModels = [...prev.data];
                    const updatedData = currentModels.map(item => {
                        const newModelResponse = data.modelResponses.find(
                            r => r.modelName === item.modelName
                        );
                        if (newModelResponse) {
                            return {
                                ...item,
                                responses: normalizeResponses(newModelResponse.responses),
                                loading: false,
                            };
                        }
                        return item;
                    });

                    // Add any new models that weren't in the previous state
                    const newModels = data.modelResponses
                        .filter(r => !currentModels.some(item => item.modelName === r.modelName))
                        .map(newModel => ({
                            modelName: newModel.modelName,
                            role: newModel.role || 'default',
                            responses: normalizeResponses(newModel.responses),
                            loading: false,
                        }));

                    return {
                        data: [...updatedData, ...newModels],
                        loadingStates: {
                            ...prev.loadingStates,
                            ...newModels.reduce((acc, { modelName }) => ({
                                ...acc,
                                [modelName]: false
                            }), {})
                        }
                    };
                });
                
                console.log("Updated data:", data);
            } else {
                console.log("Empty data received");
                setError("Received empty data, not updating responses.");
            }
        } catch (error) {
            console.error("Error updating chat details:", error);
            if (error.response?.status === 429) {
                handleRateLimitError();
            } else {
                setError(error.message || "An error occurred while fetching data.");
            }
        }
    }, [chatId, normalizeResponses, handleRateLimitError]);

    useEffect(() => {
        updateChatDetails(); 

        const interval = setInterval(updateChatDetails, 5000); 
        return () => clearInterval(interval); 
    }, [updateChatDetails]);

    const uniqueModelResponses = modelResponses.data;
    const modelCount = uniqueModelResponses.length;

    const modelWidth = useMemo(() => {
        if (modelCount === 1) return '100%';
        if (modelCount === 2) return '50%';
        if (modelCount === 3) return '33.33%';
        return '100%';
    }, [modelCount]);

    return (
        <div className="chat-page">
            <div className="problem-statement">
                {error && (
                    <div className="error-message">
                        {getErrorMessage(error)}
                    </div>
                )}
                <p>Question: {problemStatement || 'No problem statement available'}</p>
            </div>

            {pageState.isRefreshing && <RefreshOverlay />}

            {Object.keys(hiddenModels).length > 0 && (
                <HiddenResponsesPanel 
                    hiddenModels={hiddenModels} 
                    setHiddenModels={setHiddenModels}
                    dataInitialized={!pageState.isInitialLoading}
                />
            )}

            <div className="models-container">
                {uniqueModelResponses.map(({ modelName, role, responses, loading }, index) => (
                    <IndividualModelResponse 
                        key={`${modelName}-${index}`}
                        modelName={modelName}
                        role={role}
                        responses={responses.slice(0, maxResponsesToShow)}
                        isHidden={hiddenModels[modelName]}
                        onNavigate={() => handleNavigateToChat(navigate, chatId, modelName)}
                        onToggleHide={() => toggleHide(modelName)}
                        onCopy={() => copyResponse(responses[0])}
                        getModelBackgroundColor={getModelBackgroundColor}
                        isLoading={loading}
                        dataInitialized={!pageState.isInitialLoading}
                        style={{
                            width: modelWidth
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ChatPage;

