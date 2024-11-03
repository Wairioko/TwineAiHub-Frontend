export const userLogin = async (userData) => {
    try {
        const response = await fetch('http://localhost:4000/api/auth/login', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(userData),
            credentials:"include"
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Parse the response as JSON
        console.log(data);
       
        return data;  // Return full data object
    } catch (error) {
        throw new Error(`Failed to log in: ${error}`);
    }
};



export const userRegister = async (userData) => {
    try {
        const response = await fetch('http://localhost:4000/api/auth/signup', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const errorResponse = await response.json(); // Parse the error response from backend
            throw new Error(errorResponse.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Parse the response as JSON
        
        return data;
    } catch (error) {
        throw new Error(`Failed to register: ${error.message}`);
    }
};
