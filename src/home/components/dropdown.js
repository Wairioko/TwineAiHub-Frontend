import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ options, selectedOption, onSelect }) => {
    const [isVisible, setIsVisible] = useState(false);
    const dropdownRef = useRef(null);

    const handleButtonClick = () => {
        setIsVisible(prev => !prev);
    };

    const handleOptionClick = (option) => {
        onSelect(option);
        setIsVisible(false);
    };

    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={dropdownRef} className="dropdown">
            <button className='dropbtn'
                onClick={handleButtonClick}
                aria-haspopup="listbox"
                aria-expanded={isVisible}
            >
                {selectedOption || 'Select Option'}
            </button>
            {isVisible && (
                <div className="dropdown-menu" role="listbox">
                    {options.map(option => (
                        <div 
                            key={option} 
                            onClick={() => handleOptionClick(option)}
                            role="option"
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


export default Dropdown;

