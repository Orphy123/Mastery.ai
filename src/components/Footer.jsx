import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';


function Footer() {
  const { darkMode } = useTheme();

  return (
    <footer className={`border-t ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <img src="/assets/images/Logo.png" alt="Mastery.ai" className="h-7 w-auto" />
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {[
              { to: '/search', label: 'Search' },
              { to: '/practice', label: 'Practice' },
              { to: '/chat', label: 'Chat' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-sm ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
              >
                {label}
              </Link>
            ))}
          </div>

          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            &copy; {new Date().getFullYear()} Mastery.ai
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
