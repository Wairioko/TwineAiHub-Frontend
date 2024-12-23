import React, { useState } from 'react';
import useSignup from '../hooks/useSignUp'
import { GoogleLoginButton } from './googleSignUp';

function SignUp() {
    const {
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
        handleSubmit
      } = useSignup();
    
  

  return (

    <div className="signup-container">
      <img src="/displaypage.png" alt="App preview" className="preview-image" />

      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Create Account</h2>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='username'
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder='register using company email address only.'
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='password'
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder='confirm password'
            required
          />
        </div>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">Registration successful!</p>}

        <button type="submit" className="submit-btn">Sign Up</button>
        <p>Already have an account? <a href="/login">Login</a></p>
        <div className="separator">OR</div>
          
        <GoogleLoginButton />
      </form>
    </div>
 
  );

}


export default SignUp;

