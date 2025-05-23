import axios from "axios";
import { useEffect } from "react";

export const generateToken = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_AWS_URL}/`);
    if(response.statusCode === 200){
      console.log("Welcome to TwineAiHub!");
    }
   
  } catch (error) {
    console.error('Error generating token:', error);
  }
};



export const ProblemToAssistant = async (formData) => {
  try {
    // Enable credentials globally for Axios
    

    // Sending the formData with credentials
    const response = await axios.post(
      `${process.env.REACT_APP_AWS_URL}/api/assistant/analyze`,
      formData,
      {
        withCredentials: true,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    // Extract the response body
    const parsedBody = JSON.parse(response.data.body);
    if(parsedBody.statusCode === 401){
      alert("Please register to continue")
    }

    // Return the parsed body data
    return parsedBody;
    // const data = response.data
    // return data
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

      // Create the request body as a JSON object for non-file uploads
      const requestBody = {
          problemStatement: problemStatement,
          modelAssignments: modelAssignments
      };

      

      let response;
      if (file) {
          // Use FormData for file upload
          const newFormData = new FormData();
          newFormData.append('problemStatement', problemStatement);
          newFormData.append('modelAssignments', JSON.stringify(modelAssignments));
          newFormData.append('file', file);

          response = await axios.post(`${process.env.REACT_APP_AWS_URL}/api/chat/solve`, newFormData, {
              withCredentials: true,
          });
      } else {
          // Send JSON data if there's no file
          response = await axios.post(`${process.env.REACT_APP_AWS_URL}/api/chat/solve`, requestBody, {
              withCredentials: true,
              headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/json",
              }
          });
      }

      // Handle non-2xx status codes as errors
      if (response.status < 200 || response.status >= 300) {
          throw new Error(`HTTP error! status: ${response.status}, body: ${JSON.stringify(response.data)}`);
      }

    //   // Extract the response body
    const parsedBody = JSON.parse(response.data.body);

    // Return the parsed body data
    return parsedBody;
    // const data = response.data
    // return data
  } catch (error) {
      console.error("Error sending problem to models:", error);
      throw error;
  }
};


export const getChatHistory = async () => {
  try {

      
      const response = await axios.get(`${process.env.REACT_APP_AWS_URL}/api/user/history`, {
          withCredentials: true, 
          headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
          }
      });

      // Extract the response body
    const parsedBody = JSON.parse(response.data.body);

    // Return the parsed body data
    return parsedBody.chats;
  } catch (error) {
      console.error("Error getting chat history:", error);
      throw new Error("Error getting chat history");
  }
};

export const DeleteChat = async (chatid) => {
  try {
    
      const response = await axios.delete(`${process.env.REACT_APP_AWS_URL}/api/chat/${chatid}`, {
          withCredentials: true,
          headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
          }
      });

      // Extract the response body
    const parsedBody = JSON.parse(response.data.body);

    // Return the parsed body data
    return parsedBody; 
  } catch (error) {
      console.error("Error while deleting chat:", error);
      throw new Error("Error deleting data from history");
  }
};


