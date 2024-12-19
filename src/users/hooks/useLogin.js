import { userLogin } from "../service/userServices";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const UseLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);  
        try {
            const data = {email, password};
            const response = await userLogin(data);
            
            
            if (response.data.status === 200) { 
               
                navigate('/', {replace: true}); 
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } catch (error) {
            setError(error.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);  // Reset loading state after process
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        error,
        isLoading,
        handleSubmit,
    };
}


