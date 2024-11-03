import React, { createContext, useContext, useEffect, useState } from 'react';

export const PaddleContext = createContext({
  paddleLoaded: false
});

export const PaddleProvider = ({ vendorId, children }) => {
  const [paddleLoaded, setPaddleLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!vendorId) {
      console.error('Paddle vendor ID is missing');
      setError('Paddle configuration error');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/paddle.js';
    script.async = true;

    script.onload = () => {
      try {
        // Convert vendorId to integer
        const vendorIdInt = parseInt(vendorId, 10);
        
        if (isNaN(vendorIdInt)) {
          throw new Error('Invalid vendor ID format');
        }

        window.Paddle.Setup({ vendor: vendorIdInt });
        setPaddleLoaded(true);
      } catch (err) {
        console.error('Failed to setup Paddle:', err);
        setError('Failed to initialize payment system');
      }
    };

    script.onerror = () => {
      setError('Failed to load payment system');
    };

    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [vendorId]);

  return (
    <PaddleContext.Provider value={{ paddleLoaded, error }}>
      {children}
    </PaddleContext.Provider>
  );
};

