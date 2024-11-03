export const HiddenResponsesPanel = ({ hiddenModels, setHiddenModels, dataInitialized }) => (
    <div className='hidden-responses'>
        <h3>Hidden Responses</h3>
        <ul>
            {Object.keys(hiddenModels).map(modelName => (
                <li key={modelName}>{modelName}</li>
            ))}
        </ul>
        <button
            className='show-all-responses'
            onClick={() => setHiddenModels({})}
            disabled={!dataInitialized}
        >
            Show All Responses
        </button>
    </div>
);
