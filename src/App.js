import Navbar from './components/navbar';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './home/page/HomePage';
import AuthProvider  from './authProvider';
import ChatPage from './chat/page/chatpage';
import SingleChatPage from './chat/page/singleChat';

function App() {

  

  return (
    <Router>
    <AuthProvider>
      
        <Navbar/>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path='/chat' element={<ChatPage />} />
            <Route path='/singlechat' element={<SingleChatPage />} />
          </Routes>
      

      </AuthProvider>
      </Router>
  );
}

export default App;
