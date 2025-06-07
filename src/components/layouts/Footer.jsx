import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { SparklesIcon } from '@heroicons/react/24/solid';

function Footer() {
  const { darkMode } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`mt-auto py-8 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-inner'}`}>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Logo and brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center">
              <SparklesIcon className="h-6 w-6 text-indigo-600" />
              <span className={`ml-2 text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Mastery.ai
              </span>
            </Link>
            <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Making learning efficient and enjoyable through personalized education.
            </p>
          </div>

          {/* Features */}
          <div className="md:col-span-1">
            <h3 className={`text-sm font-semibold uppercase mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Features
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/search"
                  className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Ask & Learn
                </Link>
              </li>
              <li>
                <Link
                  to="/practice"
                  className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Practice Problems
                </Link>
              </li>
              <li>
                <Link
                  to="/review"
                  className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Spaced Repetition
                </Link>
              </li>
              <li>
                <Link
                  to="/progress"
                  className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Progress Tracking
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-1">
            <h3 className={`text-sm font-semibold uppercase mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="md:col-span-1">
            <h3 className={`text-sm font-semibold uppercase mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Connect
            </h3>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className={`text-gray-400 hover:text-indigo-500 ${darkMode ? 'hover:text-indigo-400' : ''}`}
                aria-label="Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a 
                href="#" 
                className={`text-gray-400 hover:text-indigo-500 ${darkMode ? 'hover:text-indigo-400' : ''}`}
                aria-label="GitHub"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href="#" 
                className={`text-gray-400 hover:text-indigo-500 ${darkMode ? 'hover:text-indigo-400' : ''}`}
                aria-label="LinkedIn"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.7,3H4.3C3.582,3,3,3.582,3,4.3v15.4C3,20.418,3.582,21,4.3,21h15.4c0.718,0,1.3-0.582,1.3-1.3V4.3C21,3.582,20.418,3,19.7,3z M8.339,18.338H5.667v-8.59h2.672V18.338z M7.004,8.574c-0.857,0-1.549-0.694-1.549-1.548c0-0.855,0.691-1.548,1.549-1.548c0.854,0,1.547,0.694,1.547,1.548C8.551,7.881,7.858,8.574,7.004,8.574z M18.339,18.338h-2.669v-4.177c0-0.996-0.017-2.278-1.387-2.278c-1.389,0-1.601,1.086-1.601,2.206v4.249h-2.667v-8.59h2.559v1.174h0.037c0.356-0.675,1.227-1.387,2.526-1.387c2.703,0,3.203,1.779,3.203,4.092V18.338z" />
                </svg>
              </a>
            </div>

            <div className="mt-4">
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Join our newsletter to stay up to date on new features and releases.
              </p>
              <div className="mt-2 flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`px-3 py-2 text-sm rounded-l-lg w-full ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } border focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                />
                <button className="px-3 py-2 text-sm rounded-r-lg bg-indigo-600 text-white hover:bg-indigo-700">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className={`text-xs text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            © {currentYear} Mastery.ai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;