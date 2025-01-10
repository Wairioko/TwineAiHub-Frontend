import React, { createContext, useEffect, useState } from 'react';

export const PaddleContext = createContext({
  paddleLoaded: false,
  error: null,
  initializeCheckout: () => {},
});

export const PaddleProvider = ({ vendorId, children }) => {
  const [paddleLoaded, setPaddleLoaded] = useState(false);
  const [error, setError] = useState(null);

  const initializeCheckout = (checkoutData) => {
    return new Promise((resolve, reject) => {
      if (!paddleLoaded) {
        reject(new Error('Paddle not initialized'));
        return;
      }

      try {
        window.Paddle.Checkout.open({
          ...checkoutData,
          success: (data) => {
            if (checkoutData.successCallback) {
              checkoutData.successCallback(data);
            }
            resolve(data);
          },
          closed: () => {
            if (checkoutData.closeCallback) {
              checkoutData.closeCallback();
            }
            resolve(null);
          },
        });
      } catch (err) {
        reject(err);
      }
    });
  };

  useEffect(() => {
    if (!vendorId) {
      setError('Paddle vendor ID is missing');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/paddle.js';
    script.async = true;

    script.onload = () => {
      try {
        const vendorIdInt = parseInt(vendorId, 10);
        
        if (isNaN(vendorIdInt)) {
          throw new Error('Invalid vendor ID format');
        }

        window.Paddle.Setup({ vendor: vendorIdInt });
        setPaddleLoaded(true);
        setError(null);
      } catch (err) {
        setError('Failed to initialize payment system');
        console.error('Paddle setup error:', err);
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
    <PaddleContext.Provider value={{ paddleLoaded, error, initializeCheckout }}>
      {children}
    </PaddleContext.Provider>
  );
};

