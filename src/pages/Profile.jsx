import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { profileService } from '../services/profile';
import { UserCircleIcon } from '@heroicons/react/24/outline';

function Profile() {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    preferences: {
      theme: 'light',
      notifications: true,
    },
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await profileService.getProfile();
      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        preferences: data.preferences || {
          theme: 'light',
          notifications: true,
        },
      });
    } catch (err) {
      setError('Failed to load profile');
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const updatedProfile = await profileService.updateProfile({
        full_name: formData.full_name,
        preferences: formData.preferences,
      });
      setProfile(updatedProfile);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updatedProfile = await profileService.uploadAvatar(file);
      setProfile(updatedProfile);
      setSuccess('Avatar updated successfully');
    } catch (err) {
      setError('Failed to upload avatar');
      console.error('Error uploading avatar:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className={`rounded-lg shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="p-6">
          <h1 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Profile Settings
          </h1>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-800">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-800">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 text-gray-300 border-gray-600'
                    : 'bg-gray-50 text-gray-900 border-gray-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-white text-gray-900 border-gray-300'
                } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Avatar
              </label>
              <div className="flex items-center space-x-4">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="h-20 w-20 text-gray-400" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className={`px-4 py-2 rounded-lg cursor-pointer ${
                    darkMode
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  Change Avatar
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Preferences
              </label>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notifications"
                    checked={formData.preferences.notifications}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferences: {
                          ...formData.preferences,
                          notifications: e.target.checked,
                        },
                      })
                    }
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="notifications"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    Enable Notifications
                  </label>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full px-4 py-2 rounded-lg ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : darkMode
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } text-white font-medium`}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;