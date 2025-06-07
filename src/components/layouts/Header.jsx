import React, { useState, useEffect } from 'react';
import { Link, useLocation, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();

  // Navigation links configuration
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Search', path: '/search' },
    { name: 'Practice', path: '/practice' },
    { name: 'Review', path: '/review' },
    { name: 'Progress', path: '/progress' },
  ];

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-30 transition-all duration-300 ${
        darkMode 
          ? `bg-gray-900 ${scrolled ? 'shadow-md shadow-gray-800/20' : ''}` 
          : `bg-white ${scrolled ? 'shadow-md' : ''}`
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <SparklesIcon className="h-8 w-8 text-indigo-600 animate-sparkle" />
            <span className={`ml-2 text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Mastery.ai
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `
                  px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
                end={link.path === '/'}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 mr-2"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5 text-yellow-400" />
              ) : (
                <MoonIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>

            {/* Profile or login */}
            {currentUser ? (
              <Link
                to="/profile"
                className="flex items-center px-3 py-2 rounded-lg font-medium text-sm bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-200 dark:hover:bg-indigo-900"
              >
                <UserCircleIcon className="h-5 w-5 mr-1" />
                Profile
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center px-3 py-2 rounded-lg font-medium text-sm bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="ml-4 md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} py-2 px-4 shadow-lg`}>
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `
                  px-3 py-3 rounded-lg text-base font-medium
                  ${isActive 
                    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200' 
                    : 'text-gray-700 dark:text-gray-200'
                  }
                `}
                end={link.path === '/'}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;