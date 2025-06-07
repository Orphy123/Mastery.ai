// src/services/firebase.js
// Service for Firebase authentication integration

// In demo mode, we'll simulate authentication instead of using actual Firebase
export const isDemo = true;

/**
 * Firebase configuration
 * For demo purposes, these will not be actual Firebase credentials
 */
const firebaseConfig = {
  apiKey: "DEMO_API_KEY",
  authDomain: "Mastery.ai-demo.firebaseapp.com",
  projectId: "Mastery.ai-demo",
  storageBucket: "Mastery.ai-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};

// Mock Firebase auth for demo mode
const mockAuth = {
  onAuthStateChanged: (callback) => {
    // Check if user exists in localStorage
    const storedUser = localStorage.getItem('Mastery.ai_user');
    if (storedUser) {
      callback(JSON.parse(storedUser));
    } else {
      callback(null);
    }
    
    // Return unsubscribe function
    return () => {};
  },
  
  signOut: async () => {
    localStorage.removeItem('Mastery.ai_user');
    return Promise.resolve();
  },
  
  currentUser: null
};

/**
 * Initialize Firebase
 * In a real implementation, this would use actual Firebase SDK
 */
export const initializeFirebase = () => {
  // In production, this would initialize Firebase
  console.log('Firebase would be initialized with:', firebaseConfig);
  
  // In production, auth would be firebase.auth()
  return {
    app: null,
    auth: mockAuth
  };
};

// Initialize and export auth instance
const { auth } = initializeFirebase();
export { auth };

/**
 * Get the current authenticated user
 * @returns {Object|null} - User object or null if not logged in
 */
export const getCurrentUser = () => {
  if (isDemo) {
    const storedUser = localStorage.getItem('Mastery.ai_user');
    return storedUser ? JSON.parse(storedUser) : null;
  } else {
    return auth.currentUser;
  }
};

/**
 * Create demo user with given email (for passwordless auth simulation)
 * @param {string} email - User's email address
 * @returns {Object} - Demo user object
 */
export const createDemoUser = (email) => {
  return {
    uid: `demo-${Date.now()}`,
    email,
    emailVerified: true,
    displayName: email.split('@')[0],
    photoURL: null,
    isAnonymous: false
  };
};

/**
 * Set the current demo user
 * @param {Object} user - User object
 */
export const setDemoUser = (user) => {
  if (user) {
    localStorage.setItem('Mastery.ai_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('Mastery.ai_user');
  }
};