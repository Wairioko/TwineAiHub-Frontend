// Response processing utility
export const getUniqueModelResponses = (responses) => {
    if (!Array.isArray(responses)) return [];

    const responseMap = new Map();
    responses.forEach(response => {
        if (!response?.modelName) return;

        const existing = responseMap.get(response.modelName) || {
            modelName: response.modelName,
            role: response.role,
            loading: false,
            responses: []
        };

        if (response.responses) {
            const newResponses = Array.isArray(response.responses) 
                ? response.responses 
                : [response.responses];
            existing.responses = [...existing.responses, ...newResponses];
        }

        responseMap.set(response.modelName, existing);
    });

    return Array.from(responseMap.values());
};
