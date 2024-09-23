import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../authProvider';

export const Navbar = () => {
  const { isAuthenticated, handleLogout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const closeMenu = (e) => {
      if (isMenuOpen && !e.target.closest('.sliding-menu') && !e.target.closest('.nav-toggle')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, [isMenuOpen]);

  return (
    <nav>
      <div className="nav-container">
        <div className="nav-center">
          <Link to={'/'}>
          <h1>AIFlow</h1>
          <p>Seamless AI Integration, Infinite Possibilities</p>
          </Link>
        </div>
        <button className="nav-toggle" onClick={toggleMenu}>
          ☰
        </button>
        <div className={`sliding-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul>
            {!isAuthenticated ? (
              <>
                <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
                <li><Link to="/login" onClick={toggleMenu}>Login</Link></li>
                <li><Link to="/signup" onClick={toggleMenu}>Sign Up</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/profile" onClick={toggleMenu}>Profile</Link></li>
                <li><button onClick={() => { handleLogout(); toggleMenu(); }}>Logout</button></li>
              </>
            )}
          </ul>
        </div>
        <div className="nav-right">
          <ul>
            {!isAuthenticated ? (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">Sign Up</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/profile">Profile</Link></li>
                <li><button onClick={handleLogout}>Logout</button></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

