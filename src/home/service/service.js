export const ProblemToAssistant = async (problemStatement) => {
    try {
      const response = await fetch('http://localhost:4000/api/assistant/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ problemstatement: problemStatement }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Received data from server:", data);
      return data;
    } catch (error) {
      console.error("Error in ProblemToAssistant:", error);
      throw error;
    }
};

export const ProblemToModels = async (data) => {
  const { problemStatement, modelAssignments } = data;

  try {
      console.log("Data being sent to server:", JSON.stringify(data, null, 2));
      
      const response = await fetch('http://localhost:4000/api/chat/solve', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ problemStatement, modelAssignments }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response body:", errorText);
          throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      // Parse the JSON response
      const responseData = await response.json();
      console.log("Response data:", responseData);

      // Return the data (including chatId) from the response
      return responseData;
  } catch (error) {
      console.error("Error in ProblemToModels:", error);
      throw error;
  }
};

