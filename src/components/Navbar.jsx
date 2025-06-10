import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon, UserCircleIcon } from '@heroicons/react/24/outline';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Mastery.ai
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/search"
                className={`${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-900 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium`}
              >
                Search
              </Link>
              <Link
                to="/practice"
                className={`${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-900 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium`}
              >
                Practice
              </Link>
              <Link
                to="/review"
                className={`${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-900 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium`}
              >
                Review
              </Link>
              <Link
                to="/chat"
                className={`${
                  darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-900 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium`}
              >
                Chat
              </Link>
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg ${
                darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-900 hover:text-gray-700'
              }`}
            >
              {darkMode ? (
                <SunIcon className="h-6 w-6" />
              ) : (
                <MoonIcon className="h-6 w-6" />
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className={`p-2 rounded-lg ${
                    darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-900 hover:text-gray-700'
                  }`}
                >
                  <UserCircleIcon className="h-6 w-6" />
                </button>

                {isProfileMenuOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${
                      darkMode ? 'bg-gray-700' : 'bg-white'
                    } ring-1 ring-black ring-opacity-5`}
                  >
                    <Link
                      to="/profile"
                      className={`block px-4 py-2 text-sm ${
                        darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      Your Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                  darkMode
                    ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                    : 'text-white bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                Sign in
              </Link>
            )}
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
              } hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500`}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className={`pt-2 pb-3 space-y-1 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <Link
            to="/search"
            className={`${
              darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-50'
            } block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium`}
          >
            Search
          </Link>
          <Link
            to="/practice"
            className={`${
              darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-50'
            } block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium`}
          >
            Practice
          </Link>
          <Link
            to="/review"
            className={`${
              darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-50'
            } block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium`}
          >
            Review
          </Link>
          <Link
            to="/chat"
            className={`${
              darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-50'
            } block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium`}
          >
            Chat
          </Link>
        </div>

        <div className={`pt-4 pb-3 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          {user ? (
            <>
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <UserCircleIcon className="h-10 w-10 text-gray-400" />
                </div>
                <div className="ml-3">
                  <div className={`text-base font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {user.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  to="/profile"
                  className={`block px-4 py-2 text-base font-medium ${
                    darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Your Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className={`block w-full text-left px-4 py-2 text-base font-medium ${
                    darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <div className="mt-3 space-y-1">
              <Link
                to="/login"
                className={`block px-4 py-2 text-base font-medium ${
                  darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-50'
                }`}
              >
                Sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 