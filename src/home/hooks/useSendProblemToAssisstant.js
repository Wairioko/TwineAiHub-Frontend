import { useState} from "react";
import {ProblemToAssistant, ProblemToModels}from "../service/service";
import { useNavigate } from "react-router-dom";


const useSendProblem = () => {
    const [problemStatement, setProblemStatement] = useState('');
    const [assistantBreakdown, setAssistantBreakdown] = useState('')
    const [isAssistantEnabled, setIsAssistantEnabled] = useState(false);
    const [modelRoles, setModelRoles] = useState(['', '', '']);
    const [selectedModels, setSelectedModels] = useState(['', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    

    const handleToggleChange = () => {
        setIsAssistantEnabled(!isAssistantEnabled);
    };


    const handleSubmitProblemToAssistant = async (e) => {
        e.preventDefault();
        if (isAssistantEnabled) {
          setIsLoading(true);
          try {
            const assistantAnalysis = await ProblemToAssistant(problemStatement);
            setAssistantBreakdown(assistantAnalysis);
          } catch (error) {
            console.error("Error submitting problem:", error);
            setAssistantBreakdown('An error occurred while analyzing the problem.');
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
        e.preventDefault();  // Prevent the default form submit action
    
        const modelAssignments = selectedModels.map((model, index) => ({
            model,
            role: modelRoles[index],
        }));
    
        // Prepare the data object to send to the server
        const dataToSend = {
            problemStatement: problemStatement,
            modelAssignments: modelAssignments,
        };
        
        console.log("data to server", dataToSend);
        
        try {
            // Send the data to the server
            const data = await ProblemToModels(dataToSend);
            const { chatId } = data;
            
            if (chatId) {
                console.log(chatId);
                console.log(problemStatement);
                console.log(modelAssignments);
                
                // Navigate to the ChatPage and pass only serializable data in the state
                navigate(`/chat/${chatId}`, { 
                    state: { 
                        chatId, 
                        problemStatement, 
                        modelAssignments 
                    } 
                });
            }
        } catch (error) {
            console.error("Error sending problem to models:", error);
        }
    };
    

    return {problemStatement, setProblemStatement,isAssistantEnabled, setIsAssistantEnabled 
        ,assistantBreakdown, handleToggleChange ,setAssistantBreakdown,
        modelRoles, setModelRoles, handleModelSelect, handleSubmitToBuild, 
        selectedModels, isLoading ,setSelectedModels, handleRoleChange, handleSubmitProblemToAssistant
    }
    
}
 

export default useSendProblem;

