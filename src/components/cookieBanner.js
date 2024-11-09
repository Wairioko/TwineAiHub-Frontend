import React, { useState, useEffect } from 'react';

const CookieBanner = () => {
  const [isBannerVisible, setIsBannerVisible] = useState(false);

  useEffect(() => {
    const cookieAccepted = localStorage.getItem('cookieAccepted');
    if (!cookieAccepted) {
      setIsBannerVisible(true);
    }
  }, []);

  const acceptCookiePolicy = () => {
    localStorage.setItem('cookieAccepted', 'true');
    setIsBannerVisible(false);
  };

  return (
    isBannerVisible && (
      <div style={bannerStyle}>
        <p>We use cookies to improve your experience on our site. By using our site, you accept our cookie policy.</p>
        <button onClick={acceptCookiePolicy} style={buttonStyle}>Accept</button>
      </div>
    )
  );
};

// Basic styling
const bannerStyle = {
  position: 'fixed',
  bottom: 0,
  width: '100%',
  backgroundColor: '#333',
  color: '#fff',
  textAlign: 'center',
  padding: '1em',
};

const buttonStyle = {
  marginLeft: '1em',
  padding: '0.5em 1em',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
};


export default CookieBanner;

