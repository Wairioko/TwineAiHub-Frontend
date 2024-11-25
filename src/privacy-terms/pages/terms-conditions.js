import React, { useState, useEffect } from 'react';


const TermsAndConditions = () => {
  const [termsText, setTermsText] = useState('');

  useEffect(() => {
    fetch('/twineterms.txt')
      .then((response) => response.text())
      .then((data) => setTermsText(data))
      .catch((error) => console.error('Error loading terms:', error));
  }, []);

  return (
    <div className="terms-container">
      <pre className="terms-content">{termsText}</pre>
    </div>
  );
};

export default TermsAndConditions;
