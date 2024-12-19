import { useState } from "react";
import { userRegister } from "../service/userServices";
import { useNavigate } from "react-router-dom";


const useSignup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure email is a company email
        // const companyEmailRegex = /^[\w.%+-]+@yourcompany\.com$/;
        // if (!companyEmailRegex.test(email)) {
        //     setError('Please use your company email to register.');
        //     return;
        // }
        if(!email){
            setError('Please enter your email');
            return;
        }

        // Ensure password and confirm password match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const userData = { email, password, username };

            // Call the user registration service
            const response = await userRegister(userData);
            if(response.data.status === 200){
                 // If registration is successful
                setSuccess(true);
                setError('');
                alert('Successfully registered');
                
                // Navigate to login page after a short delay
                setTimeout(() => {
                    navigate('/login');
                }, 1000);

            }
           
        } catch (error) {
            // Capture the error and display it
            setError(error.message);
            setSuccess(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        username,
        setUsername,
        error,
        success,
        handleSubmit,
    };
};


export default useSignup;

