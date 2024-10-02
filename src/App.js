import Navbar from './components/navbar';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './home/page/HomePage';
import AuthProvider  from './authProvider';
import ChatPage from './chat/page/chatpage';
import SingleChatPage from './chat/page/singleChat';
import { Provider } from 'react-redux';
import {store, persistor} from './store/index';
import { PersistGate } from 'redux-persist/integration/react';
import {LoginPage} from './users/pages/Login'
import SignupPage from './users/pages/Signup'
import SignupEmail from './users/pages/SignUpEmail';
import GoogleCallbackHandler from './auth/auth';


function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <AuthProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/chat/:chatid" element={<ChatPage />} />
              <Route path="/chat/:chatid/:name" element={<SingleChatPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/signup-email" element={<SignupEmail />} />
              <Route path="/google/auth/callback" element={<GoogleCallbackHandler />} />

            </Routes>
          </AuthProvider>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;

