import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import { AuthProvider } from 'react-oidc-context';

// const cognitoAuthConfig = {
//   authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_LTkM1F1HZ",
//   client_id: "7hljljjtpgrqr26m8ssdiv9775",
//   redirect_uri: "https://twineaihub.com/",
//   response_type: "code",
//   scope: "email openid profile",
// };




// const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <AuthProvider {...cognitoAuthConfig}> */}
    <App />
    {/* </AuthProvider> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
