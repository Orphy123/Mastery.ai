import React, { createContext, useContext, useState, useEffect } from 'react';

// Create theme context
const ThemeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
  fontSize: 'medium',
  changeFontSize: () => {}
});

// Custom hook for using theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('Mastery.ai_darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  
  const [fontSize, setFontSize] = useState(() => {
    const savedSize = localStorage.getItem('Mastery.ai_fontSize');
    return savedSize || 'medium';
  });
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };
  
  // Change font size
  const changeFontSize = (size) => {
    if (['small', 'medium', 'large'].includes(size)) {
      setFontSize(size);
    }
  };
  
  // Update localStorage when preferences change
  useEffect(() => {
    localStorage.setItem('Mastery.ai_darkMode', JSON.stringify(darkMode));
    
    // Apply dark mode to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  useEffect(() => {
    localStorage.setItem('Mastery.ai_fontSize', fontSize);
    
    // Apply font size to document
    document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg');
    switch (fontSize) {
      case 'small':
        document.documentElement.classList.add('text-sm');
        break;
      case 'large':
        document.documentElement.classList.add('text-lg');
        break;
      default:
        document.documentElement.classList.add('text-base');
    }
  }, [fontSize]);
  
  // Context value
  const value = {
    darkMode,
    toggleDarkMode,
    fontSize,
    changeFontSize
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};