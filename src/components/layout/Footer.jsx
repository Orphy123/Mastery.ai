import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { SparklesIcon } from '@heroicons/react/24/outline';

function Footer() {
  const { darkMode } = useTheme();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`py-8 ${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="flex items-center">
              <SparklesIcon className="h-6 w-6 text-indigo-500 mr-2" />
              <span className="font-bold text-lg">Mastery.ai</span>
            </Link>
            <p className="mt-2 text-sm">Learning made simple.</p>
          </div>
          
          <div className="flex flex-wrap justify-center my-4 md:my-0">
            <Link to="/" className="mx-3 my-1 hover:text-indigo-500">Home</Link>
            <Link to="/search" className="mx-3 my-1 hover:text-indigo-500">Search</Link>
            <Link to="/practice" className="mx-3 my-1 hover:text-indigo-500">Practice</Link>
            <Link to="/review" className="mx-3 my-1 hover:text-indigo-500">Review</Link>
          </div>
          
          <div className="text-sm">
            <p>&copy; {currentYear} Mastery.ai. All rights reserved.</p>
            <div className="flex justify-center md:justify-end mt-2">
              <a href="#" className="mx-2 hover:text-indigo-500">Privacy Policy</a>
              <a href="#" className="mx-2 hover:text-indigo-500">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;