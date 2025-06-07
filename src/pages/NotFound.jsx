import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

function NotFound() {
  const { darkMode } = useTheme();

  // Update page title
  React.useEffect(() => {
    document.title = 'Page Not Found - Mastery.ai';
  }, []);

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="max-w-md text-center px-4">
        <div className="mb-6 flex justify-center">
          <div className={`p-4 rounded-full ${darkMode ? 'bg-yellow-900/30' : 'bg-yellow-100'}`}>
            <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500" />
          </div>
        </div>
        
        <h1 className={`text-6xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>404</h1>
        
        <h2 className={`text-3xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Page Not Found
        </h2>
        
        <p className={`mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/"
            className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
          >
            Back to Home
          </Link>
          
          <Link
            to="/search"
            className={`px-6 py-3 rounded-lg font-medium ${
              darkMode 
                ? 'bg-gray-800 text-white hover:bg-gray-700' 
                : 'bg-white text-indigo-600 hover:bg-gray-50'
            } border border-gray-300 shadow-md hover:shadow-lg transition-colors`}
          >
            Search for Content
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;