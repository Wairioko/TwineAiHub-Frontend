import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import Navbar from './components/navbar';
import HomePage from './home/page/HomePage';
import AuthProvider from './authProvider';
import ChatPage from './chat/page/chatpage';
import SingleChatPage from './chat/page/singleChat';
import { store, persistor } from './store/index';
import { LoginPage } from './users/pages/Login';
import SignupPage from './users/pages/Signup';
import SignupEmail from './users/pages/SignUpEmail';
import GoogleCallback from './auth/auth';
import UsagePage from './usage/page/usagePage';
import ProfilePage from './profile/page/Profile';
import SubscriptionPage from './subscribe/page/subscribe';
import { PaddleProvider } from './paddle/PaddleProvider';
import  {Analytics} from "@vercel/analytics/react"
import {SpeedInsights} from "@vercel/speed-insights/react"
import { SubscriptionManagement } from './subscribe/page/subscriptionManagement';
import TermsAndConditions from './privacy-terms/pages/terms-conditions';
import PrivacyTerms from './privacy-terms/pages/privacy-terms';
import RefundConditions from './privacy-terms/pages/refund-conditions';
import { useAuth } from 'react-oidc-context';



function App() {
  

  const paddleVendorId = process.env.REACT_APP_PADDLE_VENDOR_ID;

  if (!paddleVendorId) {
    console.error('REACT_APP_PADDLE_VENDOR_ID is not defined in environment variables');
  }

  return (
   
    <Provider store={store}>
      <PaddleProvider vendorId={paddleVendorId}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
        <Analytics/>
        <SpeedInsights/>
          <AuthProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route 
                path="/chat/:chatid" 
                element={<ChatPage />} 
              />
              <Route 
                path="/chat/:chatid/:name" 
                element={
                
                    <SingleChatPage />
                 
                } 
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/signup-email" element={<SignupEmail />} />
              <Route path="/google/auth/callback" element={<GoogleCallback />} />
              <Route 
                path="/user/usage" 
                element={
             
                    <UsagePage />
            
                } 
              />
              <Route 
                path="/user/profile" 
                element={  <ProfilePage />} 
              />
              <Route path='/user/subscription' element={ <SubscriptionPage />} />
              <Route path='/user/subscription/management' element={ <SubscriptionManagement />} />
              <Route path='/terms-conditions' element={ <TermsAndConditions />} />
              <Route path='/privacy' element={ <PrivacyTerms/> } />
              <Route path='/refund' element={  <RefundConditions/>} />
            </Routes>
          </AuthProvider>
        </Router>
      </PersistGate>
      </PaddleProvider>
    </Provider>

  );
}

export default App;

