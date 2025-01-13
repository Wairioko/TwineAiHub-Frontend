import { GetUserProfile } from "../service/profile_service";
import { useState, useEffect } from 'react';

const useProfile = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null); 

    
    useEffect(() => {        
        const fetchUserData = async () => {
            try {
                const data = await GetUserProfile();
                console.log("log the user data", data);
                setUsername(data.username);
                setEmail(data.email);
            } catch (err) {
                setError("Error fetching user data");
                console.error("Fetch error:", err);
            }
    };

    fetchUserData();
        
    }, []); 

    return { username, email, error }; 
};


export default useProfile;

