import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  getUserProfile, 
  saveUserProfile, 
  getPreferences, 
  savePreferences,
  clearAllData
} from '../services/storageService';
import { 
  UserCircleIcon, 
  MoonIcon, 
  SunIcon,
  AdjustmentsHorizontalIcon,
  TrashIcon,
  ArrowLeftOnRectangleIcon,
  CheckIcon,
  XMarkIcon,
  PencilIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

function Profile() {
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleDarkMode, fontSize, changeFontSize } = useTheme();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    avatarUrl: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  // Update page title
  useEffect(() => {
    document.title = 'Your Profile - Mastery.ai';
  }, []);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);
  
  // Load user profile and preferences
  useEffect(() => {
    if (currentUser) {
      // Get profile data
      const userProfile = getUserProfile() || {
        email: currentUser.email,
        name: currentUser.displayName || currentUser.email.split('@')[0],
        avatarUrl: currentUser.photoURL || null
      };
      
      setProfile(userProfile);
      setEditForm({
        name: userProfile.name || '',
        avatarUrl: userProfile.avatarUrl || ''
      });
      
      // Get preferences
      const userPreferences = getPreferences();
      setPreferences(userPreferences);
    }
  }, [currentUser]);
  
  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value
    });
  };
  
  // Handle difficulty change
  const handleDifficultyChange = (difficulty) => {
    const updatedPreferences = {
      ...preferences,
      difficulty
    };
    
    savePreferences(updatedPreferences);
    setPreferences(updatedPreferences);
    
    showNotification('Learning level updated successfully', 'success');
  };
  
  // Save profile changes
  const handleSaveProfile = () => {
    const updatedProfile = {
      ...profile,
      name: editForm.name,
      avatarUrl: editForm.avatarUrl
    };
    
    saveUserProfile(updatedProfile);
    setProfile(updatedProfile);
    setEditing(false);
    
    showNotification('Profile updated successfully', 'success');
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  // Handle data deletion
  const handleDeleteData = () => {
    clearAllData();
    setShowDeleteConfirm(false);
    showNotification('All learning data has been deleted', 'success');
  };
  
  // Show notification
  const showNotification = (message, type) => {
    setNotification({ 
      show: true, 
      message, 
      type 
    });
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };
  
  if (!currentUser || !profile || !preferences) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-[calc(100vh-200px)]">
      {/* Header Section */}
      <section className={`py-10 ${darkMode ? 'bg-gray-800/50' : 'bg-indigo-50/50'} rounded-xl`}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="mb-6 flex justify-center">
            {profile.avatarUrl ? (
              <img 
                src={profile.avatarUrl} 
                alt={profile.name} 
                className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500"
              />
            ) : (
              <div className={`w-24 h-24 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-indigo-100'}`}>
                <UserCircleIcon className="w-16 h-16 text-indigo-500" />
              </div>
            )}
          </div>
          
          <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {profile.name}
          </h1>
          
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {profile.email}
          </p>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-6">
          {/* Notification */}
          {notification.show && (
            <div className={`mb-6 p-3 rounded-lg flex items-center ${
              notification.type === 'success' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {notification.type === 'success' 
                ? <CheckIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                : <XMarkIcon className="h-5 w-5 mr-2 flex-shrink-0" />
              }
              <span>{notification.message}</span>
            </div>
          )}
          
          {/* Profile Settings */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 mb-8`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Profile Settings
              </h2>
              
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className={`px-3 py-1 rounded-lg text-sm flex items-center ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <PencilIcon className="h-4 w-4 mr-1" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditing(false)}
                    className={`px-3 py-1 rounded-lg text-sm flex items-center ${
                      darkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <XMarkIcon className="h-4 w-4 mr-1" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-sm flex items-center hover:bg-indigo-700"
                  >
                    <CheckIcon className="h-4 w-4 mr-1" />
                    Save
                  </button>
                </div>
              )}
            </div>
            
            {editing ? (
              <div className="space-y-4">
                <div>
                  <label 
                    htmlFor="name" 
                    className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={editForm.name}
                    onChange={handleChange}
                    className={`w-full py-2 px-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode
                        ? 'bg-gray-700 text-white border-gray-600'
                        : 'bg-white text-gray-900 border-gray-300'
                    } border`}
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="avatarUrl" 
                    className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    Avatar URL
                  </label>
                  <input
                    id="avatarUrl"
                    name="avatarUrl"
                    type="text"
                    value={editForm.avatarUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/avatar.jpg"
                    className={`w-full py-2 px-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode
                        ? 'bg-gray-700 text-white border-gray-600'
                        : 'bg-white text-gray-900 border-gray-300'
                    } border`}
                  />
                  <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Enter a URL to an image for your profile picture
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Name
                  </h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {profile.name}
                  </p>
                </div>
                
                <div>
                  <h3 className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Email
                  </h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {profile.email}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Preferences */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 mb-8`}>
            <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
              Learning Preferences
            </h2>
            
            <div className="space-y-6">
              {/* Difficulty Selection */}
              <div>
                <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Default Learning Level
                </h3>
                <div className="flex space-x-2 md:w-1/2">
                  {['elementary', 'middle', 'high', 'college'].map((level) => (
                    <button
                      key={level}
                      onClick={() => handleDifficultyChange(level)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                        preferences.difficulty === level
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200' 
                          : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Theme Toggle */}
              <div>
                <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Display Theme
                </h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleDarkMode}
                    className={`px-4 py-2 rounded-lg flex items-center ${
                      darkMode 
                        ? 'bg-gray-700 text-gray-300' 
                        : 'bg-white border border-gray-300 text-gray-700'
                    }`}
                  >
                    {darkMode ? (
                      <>
                        <SunIcon className="h-5 w-5 mr-2 text-yellow-400" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <MoonIcon className="h-5 w-5 mr-2 text-gray-500" />
                        Dark Mode
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Font Size */}
              <div>
                <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Font Size
                </h3>
                <div className="flex space-x-2 md:w-1/2">
                  {['small', 'medium', 'large'].map((size) => (
                    <button
                      key={size}
                      onClick={() => changeFontSize(size)}
                      className={`flex-1 py-2 rounded-lg ${
                        fontSize === size
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200' 
                          : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`
                      }`}
                    >
                      <span className={`font-medium ${
                        size === 'small' ? 'text-xs' : size === 'large' ? 'text-base' : 'text-sm'
                      }`}>
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Account Actions */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6`}>
            <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
              <ShieldCheckIcon className="h-5 w-5 mr-2" />
              Account Management
            </h2>
            
            <div className="space-y-4">
              {/* Delete Learning Data */}
              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Delete Learning Data</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Remove all your learning history and progress
                  </p>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 rounded-lg bg-red-100 text-red-700 text-sm font-medium hover:bg-red-200 flex items-center"
                >
                  <TrashIcon className="h-4 w-4 mr-1" />
                  Clear Data
                </button>
              </div>
              
              {/* Sign Out */}
              <div className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Sign Out</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Log out of your account
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 text-sm font-medium hover:bg-indigo-200 flex items-center"
                >
                  <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-1" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`max-w-md w-full rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Delete Learning Data?
            </h3>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              This will permanently delete all your learning history, practice results, and progress data. 
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteData}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700"
              >
                Delete Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;