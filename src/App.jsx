import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createContext } from 'react';
import { auth, getCurrentUser, createDemoUser, setDemoUser } from './services/firebase';

// Import pages
import Home from './pages/Home';
import Search from './pages/Search';
import Login from './pages/Login';
import Practice from './pages/Practice';
import Review from './pages/Review';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import ForgotPassword from './pages/ForgotPassword';
import Chat from './pages/Chat';

// Import contexts
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Import layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Navbar from './components/Navbar';

// Create context
export const AppContext = createContext({});

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  // Set up app-wide state
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Initialize app
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setIsInitialized(true);
    });

    return unsubscribe;
  }, []);

  // Auth helper functions for context
  const authContextValue = {
    currentUser,
    isAuthenticated: !!currentUser,
    isInitialized,
    
    // Password-less auth functions
    async sendLoginLink(email) {
      // In real app, this would send an email link
      console.log('Would send login link to:', email);
      
      // For demo, create and set a demo user immediately
      const demoUser = createDemoUser(email);
      setDemoUser(demoUser);
      setCurrentUser(demoUser);
      
      return Promise.resolve();
    },
    
    async signInWithOTP(email, url) {
      // In real app, would verify OTP/email link
      console.log('Signing in with:', email, url);
      
      const demoUser = createDemoUser(email);
      setDemoUser(demoUser);
      setCurrentUser(demoUser);
      
      return Promise.resolve();
    },
    
    checkSignInLink(url) {
      // In real app, would check if URL is a valid sign-in link
      return url.includes('signIn');
    },
    
    getStoredEmail() {
      return localStorage.getItem('emailForSignIn');
    },
    
    async logout() {
      await auth.signOut();
      setCurrentUser(null);
    }
  };

  // Wait for auth to initialize
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AuthProvider value={authContextValue}>
      <ThemeProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                
                {/* Protected routes */}
                <Route path="/search" element={
                  <ProtectedRoute>
                    <Search />
                  </ProtectedRoute>
                } />
                <Route path="/practice" element={
                  <ProtectedRoute>
                    <Practice />
                  </ProtectedRoute>
                } />
                <Route path="/review" element={
                  <ProtectedRoute>
                    <Review />
                  </ProtectedRoute>
                } />
                <Route path="/progress" element={
                  <ProtectedRoute>
                    <Progress />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/chat" element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                } />
                
                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;