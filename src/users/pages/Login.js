import React from "react";
import { UseLogin } from "../hooks/useLogin";
import { useState } from "react";
import { GoogleLoginButton } from "./Signup";


export const LoginPage = () => {
    const {
        email,
        setEmail,
        password,
        setPassword,
        error,
        isLoading,
        handleSubmit,
    } = UseLogin();

    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="signup-container">
            
            <img src="/displaypage.jpg" alt="App preview" className="preview-image" />

           
                <div className="login">
                
                    {error && <div className="error">{error}</div>}
                    {isLoading && <div className="loading">Loading...</div>}

                    <form onSubmit={handleSubmit} className="login-form">
                        <h1 className="header">Login</h1>
                        <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder='Please enter your email.'
                        />
                        </div>

                        <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="password-input"
                                placeholder="Enter your password"
                                required
                            />
                        <button
                            type="button"
                            className="toggle-password-btn"
                            onClick={() => setShowPassword(!showPassword)}
                            >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                        </div>

                        
                       
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="form-group-btn"
                            >
                                Login
                            </button>
                   
                    </form>
                    <div className="signup-options">
                    <div className="separator">OR</div>
                    
                    </div>
                    <GoogleLoginButton />
                </div>
            </div>
        
    );
};

export default LoginPage;

