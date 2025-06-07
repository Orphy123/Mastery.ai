import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Bars3Icon, 
  XMarkIcon, 
  SunIcon, 
  MoonIcon,
  UserCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, isAuthenticated } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  const handleProfileClick = () => {
    closeMenu();
    navigate('/profile');
  };
  
  // Navigation links
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Search', path: '/search', authRequired: true },
    { name: 'Practice', path: '/practice', authRequired: true },
    { name: 'Review', path: '/review', authRequired: true },
    { name: 'Progress', path: '/progress', authRequired: true },
  ];
  
  return (
    <header className={`sticky top-0 z-50 shadow-md ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <SparklesIcon className="h-8 w-8 text-indigo-500 mr-2" />
            <span className="text-xl font-bold">Mastery.ai</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              // Show only appropriate links based on auth status
              if (link.authRequired && !isAuthenticated) {
                return null;
              }
              
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) => `
                    font-medium transition-colors
                    ${isActive 
                      ? 'text-indigo-600 dark:text-indigo-400' 
                      : `${darkMode ? 'text-gray-200 hover:text-white' : 'text-gray-800 hover:text-indigo-600'}`}
                  `}
                >
                  {link.name}
                </NavLink>
              );
            })}
          </nav>
          
          {/* Right side actions */}
          <div className="flex items-center">
            {/* Theme toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <SunIcon className="h-6 w-6 text-yellow-400" />
              ) : (
                <MoonIcon className="h-6 w-6 text-gray-600" />
              )}
            </button>
            
            {/* User menu (desktop) */}
            <div className="hidden md:block ml-4">
              {isAuthenticated ? (
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={handleProfileClick}
                >
                  <span className="mr-2 text-sm">{currentUser?.displayName || currentUser?.email?.split('@')[0]}</span>
                  {currentUser?.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt="User" 
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <UserCircleIcon className="h-8 w-8 text-gray-400" />
                  )}
                </div>
              ) : (
                <Link 
                  to="/login"
                  className="py-2 px-4 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700"
                >
                  Sign In
                </Link>
              )}
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="ml-4 md:hidden p-2 rounded-md"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className={`md:hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} shadow-lg`}>
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => {
                // Show only appropriate links based on auth status
                if (link.authRequired && !isAuthenticated) {
                  return null;
                }
                
                return (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    onClick={closeMenu}
                    className={({ isActive }) => `
                      py-2 px-3 rounded-md font-medium
                      ${isActive 
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' 
                        : `${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-200'}`}
                    `}
                  >
                    {link.name}
                  </NavLink>
                );
              })}
              
              {/* Show login/profile in mobile menu */}
              {isAuthenticated ? (
                <NavLink
                  to="/profile"
                  onClick={closeMenu}
                  className={({ isActive }) => `
                    py-2 px-3 rounded-md font-medium flex items-center
                    ${isActive 
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' 
                      : `${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-200'}`}
                  `}
                >
                  <UserCircleIcon className="h-5 w-5 mr-2" />
                  My Profile
                </NavLink>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="py-2 px-3 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700"
                >
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;