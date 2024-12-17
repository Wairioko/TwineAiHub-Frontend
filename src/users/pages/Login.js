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
        <div className="login-page">
            {/* Left section for image or slideshow */}
            <div className="image-section">
                <img
                    src="/public/displaypage.jpg" // Replace with your image or slideshow component
                    alt="App preview"
                    className="preview-image"
                />
            </div>

            {/* Right section for login form */}
            <div className="login-container">
                <div className="login">
                    <h1 className="header">Login</h1>

                    {error && <div className="error">{error}</div>}
                    {isLoading && <div className="loading">Loading...</div>}

                    <form onSubmit={handleSubmit} className="login-form">
                        <div>
                            <label className="email-label">Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="email-input"
                                required
                            />
                        </div>
                        <div className="password-field">
                            <label className="password-label">Password:</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="password-input"
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
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="submit-btn"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                    <div className="signup-options">
                        <span className="login-span">Or Continue With</span>
                        <GoogleLoginButton />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

