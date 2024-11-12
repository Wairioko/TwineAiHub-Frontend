import axios from "axios";


export const ProblemToAssistant = async (formData) => {
  try {
      const response = await axios.post('https://2tzlahwab9.execute-api.us-east-1.amazonaws.com/dev/api/assistant/analyze', {
          
          withCredentials: true,
          headers: {
              'Accept': 'application/json',
              // Don't set Content-Type for FormData
              
          },
        
          body: formData
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
      }

      const data = await response.json();
      console.log("this is response", data)
      return data;
  } catch (error) {
      
      console.error('Error in ProblemToAssistant:', error);
      throw error;
  }
};


export const ProblemToModels = async (formData) => {
  try {
      const problemStatement = formData.get('problemStatement');
      const modelAssignments = JSON.parse(formData.get('modelAssignments'));
      const file = formData.get('file');
      
      // Create the request body as a JSON object
      const requestBody = {
          problemStatement: problemStatement,
          modelAssignments: modelAssignments
      };

      // Initialize request options
      let requestOptions;
      if (file) {
          const newFormData = new FormData();
          newFormData.append('problemStatement', problemStatement);
          newFormData.append('modelAssignments', JSON.stringify(modelAssignments));
          newFormData.append('file', file);
          
          requestOptions = {
              method: 'POST',
              body: newFormData,
              credentials: 'include', // Include credentials for file upload as well
          };
      } else {
          requestOptions = {
              method: "POST",
              credentials: 'include', // Include credentials for JSON body as well
              headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/json", // Explicitly set Content-Type for JSON
              },
              body: JSON.stringify(requestBody)
          };
      }

      const response = await axios.get('https://2tzlahwab9.execute-api.us-east-1.amazonaws.com/dev/api/chat/solve', requestOptions);

      if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(`HTTP error! status: ${response.status}, body: ${JSON.stringify(errorBody)}`);
      }

      return await response.json();
  } catch (error) {
      console.error("Error sending problem to models:", error);
      throw error;
  }
};


export const getChatHistory = async () => {
  
  const response = await axios.get('https://2tzlahwab9.execute-api.us-east-1.amazonaws.com/dev/api/user/history', {
    
    withCredentials: true, 
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
  })

  if(!response.ok){
    throw new Error("Error getting chat history")
  }
  const data = await response.json()
  
  return data.chats
}


export const DeleteChat = async (chatid) => {
  
  try {
    const response = await axios.delete(`https://2tzlahwab9.execute-api.us-east-1.amazonaws.com/dev/api/chat/${chatid}`,{
      withCredentials: true,
      headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
      }
    }
    );

    const message = await response.json();
    return message
    
  } catch (error) {
    console.log("the error while deleting chat", error)
    throw new Error('Error deleting data from history')
  }
 
}

