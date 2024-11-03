export const ModelsList = ({ models, activeModel, onModelSelect, isRefreshing }) => {
  return (
    <div className="single-models-list" role="list">
      <h3>Models</h3>
      {models?.map(({ modelName, role }) => (
        <div
          key={modelName}
          role="listitem"
          tabIndex={0}
          className={`single-model-card ${modelName === activeModel ? 'single-active' : ''} ${
            isRefreshing && modelName === activeModel ? 'single-refreshing' : ''
          }`}
          onClick={() => onModelSelect(modelName)}
          onKeyPress={(e) => e.key === 'Enter' && onModelSelect(modelName)}
        >
          <h4 className="single-model-name">{modelName}</h4>
          {isRefreshing && modelName === activeModel && (
            <div className="single-card-loading-indicator" aria-label="Loading"></div>
          )}
        </div>
      ))}
    </div>
  );
};
  