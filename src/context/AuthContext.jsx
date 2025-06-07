import React, { createContext, useContext } from 'react';

// Create auth context
const AuthContext = createContext({
  currentUser: null,
  isAuthenticated: false,
  isInitialized: false,
  sendLoginLink: async () => {},
  signInWithOTP: async () => {},
  checkSignInLink: () => {},
  getStoredEmail: () => {},
  logout: async () => {}
});

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children, value }) => {
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};