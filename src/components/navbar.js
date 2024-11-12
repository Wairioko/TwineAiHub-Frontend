import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import  {AuthContext} from '../../src/authProvider.js';
import useGetHistory from '../home/hooks/useGetHistory.js'
import {getTimeDifference} from '../utils/utils.js'
import { useNavigate } from 'react-router-dom';
import useDeleteChat from '../home/hooks/useDeleteChat.js';


const SidebarButton = ({ onClick, children }) => (
  <button onClick={onClick} className="sidebar-button">
    {children}
  </button>
);

const Sidebar = ({ isOpen, onClose, handleLogout, chatHistory, setChatHistory }) => {
  const navigate = useNavigate();
  const { handleDeleteChat } = useDeleteChat();

  const deleteChat = (chatId) => {
    handleDeleteChat(chatId)
      .then(() => {
        setChatHistory(prevChatHistory => prevChatHistory.filter(chat => chat._id !== chatId));
      })
      .catch((err) => {
        console.error("Failed to delete chat", err);
      });
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-content">
        <button className="close-button" onClick={onClose}>&times;</button>

        <div className="sidebar-links">
          <NavLink to="/user/profile" onClick={onClose}>Profile</NavLink>
          <NavLink to="/user/subscription" onClick={onClose}>Upgrade Plan</NavLink>
          <NavLink to="/user/subscription/management" onClick={onClose}>Subscription Management</NavLink>
          <NavLink to="/user/usage" onClick={onClose}>Usage</NavLink>

        </div>

        <div className="divider"></div>
        <div className="logout-section">
          <SidebarButton onClick={() => { handleLogout(); onClose(); }}>Logout</SidebarButton>
        </div>

        <div className="divider"></div>
        <div className="chat-history">
          <h3>Chat History</h3>
          {chatHistory && chatHistory.length > 0 ? (
            <div className="card-container">
              {chatHistory.map((chat, index) => {
                
                const description = chat?.problemStatement?.description || 'No description available';
                
                return (
                  <div key={chat._id || index} className="card">
                    <div
                      onClick={() => {
                        navigate(`/chat/${chat._id}`, {
                          state: {
                            chatId: chat._id,
                            problemStatement: description,
                            modelResponses: chat.modelResponses || [],
                          },
                        });
                        window.location.reload();
                      }}
                      className="card-content"
                    >
                      <p className="problem-statement-history">{description}</p>
                      <p className="last-message-time">
                        Last message: {chat.updatedAt ? getTimeDifference(chat.updatedAt) : 'Unknown'} ago
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat._id);
                      }}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>No chat history</p>
          )}
        </div>
      </div>
    </div>
  );
};


const NavLink = ({ to, onClick, children }) => (
  <Link to={to} onClick={onClick} className="nav-link">
    {children}
  </Link>
);

const Navbar = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const { isAuthenticated, handleLogout } = useContext(AuthContext) || {};
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fetch chats 
  const { chats } = useGetHistory(isAuthenticated);

  // Update chatHistory state when chats are fetched
  useEffect(() => {
    if (chats) {
      setChatHistory(chats); 
    }
  }, [chats]);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen(prev => !prev);
  };

  useEffect(() => {
    const closeMenu = (e) => {
      if (isMenuOpen && !e.target.closest('.sidebar') && !e.target.closest('.menu-toggle')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, [isMenuOpen]);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <Link to='/' className="logo-link">
              <h1>TwineAiHub</h1>
              <p>Seamless AI Integration, Infinite Possibilities</p>
            </Link>
          </div>
          <div className="navbar-links">
            {!isAuthenticated ? (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/signup">Sign Up</NavLink>
              </>
            ) : (
              <button onClick={toggleMenu} className="menu-toggle">
                ☰
              </button>
            )}
          </div>
        </div>
      </nav>
      {isAuthenticated && (
        <Sidebar
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          handleLogout={handleLogout}
          chatHistory={chatHistory}
          setChatHistory={setChatHistory} // Pass the function to update chat history
        />
      )}
    </>
  );
};


export default Navbar;

