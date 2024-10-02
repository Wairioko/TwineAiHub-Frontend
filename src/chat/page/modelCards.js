import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const location = useLocation();

const ModelCards = () => {
    const navigate = useNavigate();


    const { modelResponses, modelAssignments } = location.state;

    const handleModelClick = (model) => {
        navigate('/singlechat', {
          state: {
            role: model.role,
            modelResponse: [{ modelName: model.modelName, response: "Initial response here" }]
          }
        });
      };
    
      return (
        <div className="model-cards">
          {modelAssignments.map((model, index) => (
            <div
              key={index}
              className="model-card"
              onClick={() => handleModelClick(model)}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '12px',
                cursor: 'pointer',
                backgroundColor: '#f9f9f9'
              }}
            >
              <h3>{model.modelName}</h3>
              <p>{model.role}</p>
            </div>
          ))}
        </div>
      );
};
    
export default ModelCards;
