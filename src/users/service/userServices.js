import axios from "axios";


export const userLogin = async (userData) => {
    try {
        const response = await axios.post(`${process.env.AWS_URL}/api/auth/login`, {
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
            withCredentials: true
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.data; // Parse the response as JSON
        console.log(data);
       
        return data;  // Return full data object
    } catch (error) {
        throw new Error(`Failed to log in: ${error}`);
    }
};



export const userRegister = async (userData) => {
    try {
        const response = await axios.post(`${process.env.AWS_URL}/api/auth/signup`, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true,
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const errorResponse = await response.data; // Parse the error response from backend
            throw new Error(errorResponse.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.data; // Parse the response as JSON
        
        return data;
    } catch (error) {
        throw new Error(`Failed to register: ${error.message}`);
    }
};
