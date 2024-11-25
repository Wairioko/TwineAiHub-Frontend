// chatHooks.js
export const useSSEConnection = (chatId) => {
    const setChatSession = useChatStore(state => state.setChatSession);
    const updateModelResponse = useChatStore(state => state.updateModelResponse);
  
    useEffect(() => {
      let eventSource;
      
      const connectSSE = () => {
        eventSource = CreateSSEConnection(chatId, (data) => {
          if (data.type === 'initial') {
            setChatSession(chatId, data);
            
          } else if (data.type === 'update') {
            data.modelResponses?.forEach(modelResponse => {
              updateModelResponse(chatId, modelResponse.modelName, modelResponse.responses?.response);
            });
          }
        });
      };
  
      connectSSE();
  
      return () => {
        if (eventSource) {
          eventSource.close();
        }
      };
    }, [chatId, setChatSession, updateModelResponse]);
};
  
