import React from 'react';
import useSendProblem from '../hooks/useSendProblemToAssisstant';
import Dropdown from '../components/dropdown';
import RoleInput from '../components/roleinput';
import ReactMarkdown from 'react-markdown'



const HomePage = () => {
    const {
        formData,
        handleInputChange,
        modelRoles,
        setModelRoles,
        selectedModels,
        setSelectedModels,
        assistantBreakdown,
        handleSubmitProblemToAssistant,
        isAssistantEnabled,
        handleSubmitToBuild,
        handleToggleChange,
        isLoading,
        handleFileUpload, error
    } = useSendProblem();

    const handleModelSelect = (index, model) => {
        setSelectedModels(prevModels => {
            const newModels = [...prevModels];
            newModels[index] = model;
            return newModels;
        });
    };

    const handleRoleChange = (index, role) => {
        setModelRoles(prevRoles => {
            const newRoles = [...prevRoles];
            newRoles[index] = role;
            return newRoles;
        });
    };

    const renderAssistantToggle = () => (
        <div className="assistant-toggle">
            <label>
                Enable Flow Assistant:
                <input
                    type="checkbox"
                    checked={isAssistantEnabled}
                    onChange={handleToggleChange}
                />
            </label>
        </div>
    );

    
    const renderProblemInput = () => (
        <form>
            <label htmlFor="problem-init" className="problem-init">Problem Overview:</label>
            <div className="input-container">
                <textarea
                    id="problem-init"
                    name="problemStatement"
                    value={formData.problemStatement}
                    onChange={handleInputChange}
                    required
                    placeholder='Type the problem you want to solve here'
                    className="problem-textarea"
                />
                <div className="file-upload-container">
                    <input
                        type="file"
                        id="file-upload"
                        className="file-input"
                        onChange={handleFileUpload}
                    />
                </div>
            </div>
        </form>
    );

    const renderAssistantAnalysis = () => (
        <form onSubmit={handleSubmitProblemToAssistant}>
            <button
                type="button"
                className="submit-to-assistant"
                onClick={handleSubmitProblemToAssistant}
                disabled={isLoading}
            >
                Assistant Analysis
            </button>
            <div className='assistant-breakdown-container'>
                <label htmlFor="assistant-breakdown" className='assistant-breakdown-label'>
                    Assistant Problem Breakdown:
                </label>
                <div className='assistant-breakdown-content'>
                    {isLoading ? (
                        <p>Generating...</p>
                    ) : (
                        <ReactMarkdown>
                            {assistantBreakdown || 'No analysis available'}
                        </ReactMarkdown>
                    )}
                </div>
            </div>
            <p className='error-message'>{error}</p>
        </form>
    );

    const renderModelAssignment = () => (
        <div>
            <label className="choose-role">Assign Roles</label>
            <ul className="assignment-list">
                {selectedModels.map((model, index) => (
                    <li key={index}>
                        <Dropdown
                            options={['ChatGpt', 'Claude', 'Gemini']}
                            selectedOption={model}
                            onSelect={(model) => handleModelSelect(index, model)}
                        />
                        {model && (
                            <RoleInput
                                role={modelRoles[index]}
                                onRoleChange={(role) => handleRoleChange(index, role)}
                            />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <div className="home-container">
            <div className="home-init-form">
                {renderAssistantToggle()}
                {renderProblemInput()}
                {!isAssistantEnabled && renderModelAssignment()}
                {isAssistantEnabled && (
                    <>
                        {renderAssistantAnalysis()}
                        {renderModelAssignment()}
                    </>
                )}
                <button
                    type="submit"
                    className="submit-form"
                    onClick={handleSubmitToBuild}
                >
                    Send To Models For Construction
                </button>
            </div>
        </div>
    );
};

export default HomePage;

