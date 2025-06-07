import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { EnvelopeIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

function Login() {
  const [email, setEmail] = useState('');
  const [linkSent, setLinkSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { darkMode } = useTheme();
  const { sendLoginLink, currentUser, checkSignInLink, getStoredEmail, signInWithOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user is already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/search');
    }
  }, [currentUser, navigate]);

  // Check if the current URL is a sign-in link
  useEffect(() => {
    const processSignInWithLink = async () => {
      if (checkSignInLink(window.location.href)) {
        // Get email from localStorage or prompt user
        let emailForSignIn = getStoredEmail();
        
        if (!emailForSignIn) {
          // If the email is not saved, ask the user
          emailForSignIn = window.prompt('Please provide your email for confirmation');
        }
        
        if (emailForSignIn) {
          setLoading(true);
          try {
            await signInWithOTP(emailForSignIn, window.location.href);
            // Clear the URL to remove the sign-in link
            navigate('/search', { replace: true });
          } catch (error) {
            setError('Error signing in with email link. Please try again.');
          } finally {
            setLoading(false);
          }
        }
      }
    };
    
    processSignInWithLink();
  }, [checkSignInLink, getStoredEmail, signInWithOTP, navigate]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      await sendLoginLink(email);
      setLinkSent(true);
    } catch (error) {
      setError('Failed to send login link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle demo login (shortcut for the demo version)
  const handleDemoLogin = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      await sendLoginLink('demo@example.com');
      navigate('/search');
    } catch (error) {
      setError('Demo login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className={`w-full max-w-md p-8 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-center mb-6">
          <SparklesIcon className="h-12 w-12 text-indigo-500" />
        </div>
        
        <h1 className={`text-3xl font-bold text-center mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Sign in to Mastery.ai
        </h1>
        
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-100 text-red-800 flex items-center">
            <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        {linkSent ? (
          <div className="text-center">
            <div className="mb-6 p-4 rounded-lg bg-green-100 text-green-800 flex items-center justify-center">
              <CheckCircleIcon className="h-6 w-6 mr-2" />
              <span>Check your email for a sign-in link!</span>
            </div>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              We've sent a sign-in link to <strong>{email}</strong>. Click the link in the email to sign in.
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Didn't receive an email? Check your spam folder or try again.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label 
                htmlFor="email" 
                className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
              >
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    darkMode 
                      ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' 
                      : 'bg-white text-gray-900 border-gray-300 placeholder-gray-400'
                  } border`}
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>
              <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                We'll send you a secure link to sign in instantly.
              </p>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                'Send Magic Link'
              )}
            </button>
            
            <div className="mt-4 text-center">
              <button
                onClick={handleDemoLogin}
                className={`text-sm ${
                  darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'
                } font-medium`}
                disabled={loading}
              >
                Use Demo Account Instead
              </button>
            </div>
          </form>
        )}
        
        <div className={`mt-8 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-xs text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            By signing in, you agree to our 
            <a href="#" className="text-indigo-500 hover:text-indigo-700 mx-1">Terms of Service</a>
            and
            <a href="#" className="text-indigo-500 hover:text-indigo-700 mx-1">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;