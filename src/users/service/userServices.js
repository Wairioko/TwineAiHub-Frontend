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

        const data = response.data;
        console.log(data);
        return data;
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
                withCredentials: true,
            }
        );

        const data = response.data; 
        return data;
    } catch (error) {
        console.error("Registration error:", error);
        throw new Error(`Failed to register: ${error.response?.statusText || error.message}`);
    }
};
