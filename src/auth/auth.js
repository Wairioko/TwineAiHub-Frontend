import { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../src/authProvider';
import { useAuth } from 'react-oidc-context'


import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");

    if (authCode) {
      // Send the code to the backend for token exchange
      fetch(`${process.env.REACT_APP_AWS_URL}/auth/google/callback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: authCode }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Save tokens or redirect to home
            localStorage.setItem("authToken", data.authToken);
            navigate("/"); // Redirect to home page
          } else {
            console.error("Authentication failed:", data.message);
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  }, []);

  return <div>Loading...</div>;
};

export default GoogleCallback;



