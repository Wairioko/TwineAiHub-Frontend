import React, { useState, useEffect } from 'react';

const PrivacyTerms = () => {
  const [termsText, setTermsText] = useState([]);

  useEffect(() => {
    fetch('/privacy.txt')
      .then((response) => response.text())
      .then((data) => {
        // Process the text into paragraphs
        const paragraphs = processParagraphs(data);
        setTermsText(paragraphs);
      })
      .catch((error) => console.error('Error loading terms:', error));
  }, []);

  // Function to process text into structured paragraphs
  const processParagraphs = (text) => {
    // Remove any extra whitespace and split by double newlines or multiple newlines
    const rawParagraphs = text.trim().split(/\n\s*\n+/);

    return rawParagraphs.map(para => {
      // Trim each paragraph
      para = para.trim();

      // Check if it's a potential heading (all uppercase and longer than 5 characters)
      if (para.toUpperCase() === para && para.length > 5) {
        return { type: 'heading', content: para };
      }

      // Regular paragraph
      return { type: 'paragraph', content: para };
    });
  };

  return (
    <div className="terms-container">
      <h1>Terms and Conditions</h1>
      <div className="terms-text">
        {termsText.length > 0 ? (
          termsText.map((item, index) => (
            <React.Fragment key={index}>
              {item.type === 'heading' ? (
                <h3>{item.content}</h3>
              ) : (
                <p>{item.content}</p>
              )}
            </React.Fragment>
          ))
        ) : (
          'Loading privacy conditions...'
        )}
      </div>
    </div>
  );
};

export default PrivacyTerms;
