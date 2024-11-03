import { useState} from "react";
import {ProblemToAssistant, ProblemToModels}from "../service/service";
import { useNavigate } from "react-router-dom";


const useSendProblem = () => {
    const [formData, setFormData] = useState({
        problemStatement: '',
        selectedFile: null
    });
    const [assistantBreakdown, setAssistantBreakdown] = useState('');
    const [isAssistantEnabled, setIsAssistantEnabled] = useState(false);
    const [modelRoles, setModelRoles] = useState(['', '', '']);
    const [selectedModels, setSelectedModels] = useState(['', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null)
    const navigate = useNavigate();

    const handleToggleChange = () => {
        setIsAssistantEnabled(!isAssistantEnabled);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        setFormData(prevData => ({
            ...prevData,
            selectedFile: file
        }));
    };


    const handleSubmitProblemToAssistant = async (e) => {
        e.preventDefault();
        setError(null);
        
        // Validate input
        if (!formData.problemStatement?.trim()) {
            setError('Problem statement is required');
            return;
        }
    
        if (isAssistantEnabled) {
            setIsLoading(true);
            
            try {
                const dataToSend = new FormData();
                dataToSend.append('problemStatement', formData.problemStatement.trim());
                
                if (formData.selectedFile) {
                    dataToSend.append('file', formData.selectedFile);
                }
    
                // To properly check what's in dataToSend, use:
                for (let pair of dataToSend.entries()) {
                    console.log("this is the data", pair[0] + ': ', pair[1]);
                }

                console.log('data to send: ', dataToSend)
    
                // Send dataToSend instead of formData
                const response = await ProblemToAssistant(dataToSend);
                
                setAssistantBreakdown(response.analysis);
            } catch (error) {
                if(error.status === 409 || 429){
                    setError(error.message)
                }else{
                    setError("Unable to submit your problem for breakdown by assistant. Please try again");
                    console.error('Error submitting problem:', error);
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleModelSelect = (index, model) => {
        const newSelectedModels = [...selectedModels];
        newSelectedModels[index] = model;
        setSelectedModels(newSelectedModels);
    };

    const handleRoleChange = (index, role) => {
        const newRoles = [...modelRoles];
        newRoles[index] = role;
        setModelRoles(newRoles);
    };

    const handleSubmitToBuild = async (e) => {
        e.preventDefault();

        // Validate problem statement
        if (!formData.problemStatement.trim()) {
            console.error("Problem statement is required");
            return;
        }

        const modelAssignments = selectedModels.map((model, index) => ({
            model,
            role: modelRoles[index],
        }));

        const submissionData = new FormData();
        submissionData.append('problemStatement', formData.problemStatement.trim());
        submissionData.append('modelAssignments', JSON.stringify(modelAssignments));
        
        if (formData.selectedFile) {
            submissionData.append('file', formData.selectedFile);
        }

        try {
            const data = await ProblemToModels(submissionData);
            const { chatId } = data;

            if (chatId) {
                navigate(`/chat/${chatId}`, {
                    state: {
                        chatId,
                        problemStatement: formData.problemStatement,
                        modelAssignments
                    }
                });
            }
        } catch (error) {
            if (error?.status === 409 || error?.status === 429) {
                setError(error.message);
            } else {
                setError("Unable to submit your problem to the models. Please try again.");
                console.error("Error sending problem to models:", error);
            }
        }
        
    };

    return {
        formData,
        handleInputChange,
        isAssistantEnabled,
        handleFileUpload,
        assistantBreakdown,
        handleToggleChange,
        setAssistantBreakdown,
        modelRoles,
        setModelRoles,
        handleModelSelect,
        handleSubmitToBuild,
        selectedModels,
        isLoading,
        setSelectedModels,
        handleRoleChange,
        handleSubmitProblemToAssistant,
        error
    };
};

export default useSendProblem;
