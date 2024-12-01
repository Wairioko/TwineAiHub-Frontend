import axios from "axios";


export const userLogin = async (userData) => {
    try {
        axios.defaults.withCredentials = true;
        const response = await axios.post(
            `${process.env.REACT_APP_AWS_URL}/api/auth/login`,
            userData, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                withCredentials: true,
            }
        );

        const parsedBody = JSON.parse(response.data.body);

        // Return the parsed body data
        return parsedBody;
    } catch (error) {
        console.error("Login error:", error);
        throw new Error(`Failed to log in: ${error.response?.statusText || error.message}`);
    }
};


export const userRegister = async (userData) => {
    try {
        axios.defaults.withCredentials = true;
        const response = await axios.post(
            `${process.env.REACT_APP_AWS_URL}/api/auth/signup`,
            userData, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
             
            }
        );

        // Extract the response body
        const parsedBody = JSON.parse(response.data.body);

        // Return the parsed body data
        return parsedBody;
    } catch (error) {
        console.error("Registration error:", error);
        throw new Error(`Failed to register: ${error.response?.statusText || error.message}`);
    }
};


