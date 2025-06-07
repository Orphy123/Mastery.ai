// src/services/storageService.js
// Service for handling local storage operations for user data

/**
 * Storage keys used by the application
 */
const STORAGE_KEYS = {
  USER_PROFILE: 'Mastery.ai_user_profile',
  PREFERENCES: 'Mastery.ai_preferences',
  SEARCH_HISTORY: 'Mastery.ai_search_history',
  PRACTICE_RESULTS: 'Mastery.ai_practice_results',
  REVIEW_ITEMS: 'Mastery.ai_review_items',
  CONCEPT_MASTERY: 'Mastery.ai_concept_mastery',
  STUDY_STATS: 'Mastery.ai_study_stats',
};

/**
 * Save user profile to local storage
 * @param {Object} profile - User profile data
 */
export const saveUserProfile = (profile) => {
  if (!profile) return;
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving user profile:', error);
  }
};

/**
 * Get user profile from local storage
 * @returns {Object|null} - User profile or null if not found
 */
export const getUserProfile = () => {
  try {
    const profile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return profile ? JSON.parse(profile) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

/**
 * Save user preferences to local storage
 * @param {Object} preferences - User preferences data
 */
export const savePreferences = (preferences) => {
  if (!preferences) return;
  try {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving preferences:', error);
  }
};

/**
 * Get user preferences from local storage
 * @returns {Object} - User preferences or default preferences if not found
 */
export const getPreferences = () => {
  try {
    const preferences = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return preferences ? JSON.parse(preferences) : {
      difficulty: 'middle',
      showHints: true,
      theme: 'auto',
    };
  } catch (error) {
    console.error('Error getting preferences:', error);
    return {
      difficulty: 'middle',
      showHints: true,
      theme: 'auto',
    };
  }
};

/**
 * Add a search query to the search history
 * @param {Object} searchItem - Search item with query and timestamp
 */
export const addToSearchHistory = (searchItem) => {
  if (!searchItem || !searchItem.query) return;
  
  try {
    const history = getSearchHistory();
    
    // Add new item to the beginning of the array
    const updatedHistory = [
      searchItem,
      ...history.filter(item => item.query !== searchItem.query) // Remove duplicates
    ].slice(0, 100); // Limit history size
    
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(updatedHistory));
    
    // Also update study stats
    updateStudyStats({ searchCount: 1, timeSpent: 2 }); // Assume each search takes 2 minutes
  } catch (error) {
    console.error('Error adding to search history:', error);
  }
};

/**
 * Get search history from local storage
 * @param {number} limit - Maximum number of items to return
 * @returns {Array} - Array of search history items
 */
export const getSearchHistory = (limit = Infinity) => {
  try {
    const history = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    const parsedHistory = history ? JSON.parse(history) : [];
    return parsedHistory.slice(0, limit);
  } catch (error) {
    console.error('Error getting search history:', error);
    return [];
  }
};

/**
 * Save practice result to local storage
 * @param {Object} result - Practice result data
 */
export const savePracticeResult = (result) => {
  if (!result) return;
  
  try {
    const results = getPracticeResults();
    const updatedResults = [result, ...results];
    
    localStorage.setItem(STORAGE_KEYS.PRACTICE_RESULTS, JSON.stringify(updatedResults));
    
    // Update concept mastery
    updateConceptMastery(result);
    
    // Update study stats
    updateStudyStats({ practiceCount: 1, correctAnswers: result.correct ? 1 : 0, timeSpent: 3 }); // Assume each practice takes 3 minutes
  } catch (error) {
    console.error('Error saving practice result:', error);
  }
};

/**
 * Get practice results from local storage
 * @returns {Array} - Array of practice result items
 */
export const getPracticeResults = () => {
  try {
    const results = localStorage.getItem(STORAGE_KEYS.PRACTICE_RESULTS);
    return results ? JSON.parse(results) : [];
  } catch (error) {
    console.error('Error getting practice results:', error);
    return [];
  }
};

/**
 * Update concept mastery based on practice results
 * @param {Object} result - Practice result data
 */
const updateConceptMastery = (result) => {
  if (!result || !result.conceptId) return;
  
  try {
    const mastery = getConceptMastery();
    const conceptId = result.conceptId;
    
    // Get existing concept mastery or create new one
    const existingMastery = mastery[conceptId] || {
      attempts: 0,
      correct: 0,
      lastAttempt: null,
      score: 0
    };
    
    // Update mastery
    const updatedMastery = {
      ...existingMastery,
      attempts: existingMastery.attempts + 1,
      correct: existingMastery.correct + (result.correct ? 1 : 0),
      lastAttempt: new Date().toISOString()
    };
    
    // Calculate score (weighted by recency)
    updatedMastery.score = updatedMastery.correct / updatedMastery.attempts;
    
    // Save updated mastery
    mastery[conceptId] = updatedMastery;
    localStorage.setItem(STORAGE_KEYS.CONCEPT_MASTERY, JSON.stringify(mastery));
  } catch (error) {
    console.error('Error updating concept mastery:', error);
  }
};

/**
 * Get concept mastery data from local storage
 * @returns {Object} - Concept mastery data keyed by concept ID
 */
export const getConceptMastery = () => {
  try {
    const mastery = localStorage.getItem(STORAGE_KEYS.CONCEPT_MASTERY);
    return mastery ? JSON.parse(mastery) : {};
  } catch (error) {
    console.error('Error getting concept mastery:', error);
    return {};
  }
};

/**
 * Save a review item to local storage
 * @param {Object} item - Review item data
 */
export const saveReviewItem = (item) => {
  if (!item || !item.id) return;
  
  try {
    const items = getReviewItems();
    
    // Check if item already exists
    const index = items.findIndex(i => i.id === item.id);
    
    if (index >= 0) {
      // Update existing item
      items[index] = item;
    } else {
      // Add new item
      items.push(item);
    }
    
    localStorage.setItem(STORAGE_KEYS.REVIEW_ITEMS, JSON.stringify(items));
    
    // Update study stats if this is a review (not just creating a new item)
    if (item.lastReviewedAt) {
      updateStudyStats({ reviewCount: 1, timeSpent: 2 }); // Assume each review takes 2 minutes
    }
  } catch (error) {
    console.error('Error saving review item:', error);
  }
};

/**
 * Get review items from local storage
 * @returns {Array} - Array of review items
 */
export const getReviewItems = () => {
  try {
    const items = localStorage.getItem(STORAGE_KEYS.REVIEW_ITEMS);
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error('Error getting review items:', error);
    return [];
  }
};

/**
 * Delete a review item from local storage
 * @param {string} itemId - ID of the review item to delete
 * @returns {boolean} - True if successful, false otherwise
 */
export const deleteReviewItem = (itemId) => {
  if (!itemId) return false;
  
  try {
    const items = getReviewItems();
    const updatedItems = items.filter(item => item.id !== itemId);
    
    localStorage.setItem(STORAGE_KEYS.REVIEW_ITEMS, JSON.stringify(updatedItems));
    return true;
  } catch (error) {
    console.error('Error deleting review item:', error);
    return false;
  }
};

/**
 * Update study statistics
 * @param {Object} stats - Statistics to update
 * @param {number} stats.searchCount - Number of searches to add
 * @param {number} stats.practiceCount - Number of practice problems to add
 * @param {number} stats.reviewCount - Number of reviews to add
 * @param {number} stats.correctAnswers - Number of correct answers to add
 * @param {number} stats.timeSpent - Time spent in minutes to add
 */
export const updateStudyStats = (stats = {}) => {
  try {
    const currentStats = getStudyStats();
    const now = new Date();
    const today = now.getDay(); // 0-6 (Sunday to Saturday)
    
    // Check if we need to update streak
    const lastActiveDate = currentStats.lastActiveDate ? new Date(currentStats.lastActiveDate) : null;
    let streakDays = currentStats.streakDays || 0;
    
    if (lastActiveDate) {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      
      // Check if last active date was yesterday or today
      if (lastActiveDate.toDateString() === yesterday.toDateString()) {
        // Last active day was yesterday, increment streak
        streakDays++;
      } else if (lastActiveDate.toDateString() !== now.toDateString()) {
        // Last active day was neither yesterday nor today, reset streak
        streakDays = 1;
      }
      // If last active day is today, don't change streak
    } else {
      // First time user is active
      streakDays = 1;
    }
    
    // Update weekly activity
    const weeklyActivity = currentStats.weeklyActivity || Array(7).fill(0);
    weeklyActivity[today] += (stats.timeSpent || 0);
    
    // Update stats
    const updatedStats = {
      ...currentStats,
      totalQuestions: (currentStats.totalQuestions || 0) + (stats.practiceCount || 0),
      correctAnswers: (currentStats.correctAnswers || 0) + (stats.correctAnswers || 0),
      searchCount: (currentStats.searchCount || 0) + (stats.searchCount || 0),
      practiceCount: (currentStats.practiceCount || 0) + (stats.practiceCount || 0),
      reviewCount: (currentStats.reviewCount || 0) + (stats.reviewCount || 0),
      timeSpent: (currentStats.timeSpent || 0) + (stats.timeSpent || 0),
      weeklyActivity,
      streakDays,
      lastActiveDate: now.toISOString()
    };
    
    localStorage.setItem(STORAGE_KEYS.STUDY_STATS, JSON.stringify(updatedStats));
  } catch (error) {
    console.error('Error updating study stats:', error);
  }
};

/**
 * Get study statistics from local storage
 * @returns {Object} - Study statistics
 */
export const getStudyStats = () => {
  try {
    const stats = localStorage.getItem(STORAGE_KEYS.STUDY_STATS);
    return stats ? JSON.parse(stats) : {
      totalQuestions: 0,
      correctAnswers: 0,
      searchCount: 0,
      practiceCount: 0,
      reviewCount: 0,
      timeSpent: 0,
      weeklyActivity: Array(7).fill(0),
      streakDays: 0,
      lastActiveDate: null
    };
  } catch (error) {
    console.error('Error getting study stats:', error);
    return {
      totalQuestions: 0,
      correctAnswers: 0,
      searchCount: 0,
      practiceCount: 0,
      reviewCount: 0,
      timeSpent: 0,
      weeklyActivity: Array(7).fill(0),
      streakDays: 0,
      lastActiveDate: null
    };
  }
};

/**
 * Clear all user data from local storage
 */
export const clearAllData = () => {
  try {
    // Keep only user profile and preferences
    const profile = getUserProfile();
    const preferences = getPreferences();
    
    // Clear all storage keys
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Restore profile and preferences
    if (profile) {
      saveUserProfile(profile);
    }
    
    if (preferences) {
      savePreferences(preferences);
    }
    
    // Reset study stats
    localStorage.setItem(STORAGE_KEYS.STUDY_STATS, JSON.stringify({
      totalQuestions: 0,
      correctAnswers: 0,
      searchCount: 0,
      practiceCount: 0,
      reviewCount: 0,
      timeSpent: 0,
      weeklyActivity: Array(7).fill(0),
      streakDays: 0,
      lastActiveDate: new Date().toISOString()
    }));
    
    return true;
  } catch (error) {
    console.error('Error clearing user data:', error);
    return false;
  }
};

/**
 * Export user data as JSON
 * @returns {Object} - User data object
 */
export const exportUserData = () => {
  try {
    const data = {};
    
    // Collect all data from storage keys
    Object.keys(STORAGE_KEYS).forEach(key => {
      const storageKey = STORAGE_KEYS[key];
      const value = localStorage.getItem(storageKey);
      
      if (value) {
        data[key] = JSON.parse(value);
      }
    });
    
    return data;
  } catch (error) {
    console.error('Error exporting user data:', error);
    return null;
  }
};

/**
 * Import user data from JSON
 * @param {Object} data - User data object
 * @returns {boolean} - True if successful, false otherwise
 */
export const importUserData = (data) => {
  if (!data) return false;
  
  try {
    // Import each data category
    Object.keys(data).forEach(key => {
      const storageKey = STORAGE_KEYS[key];
      
      if (storageKey && data[key]) {
        localStorage.setItem(storageKey, JSON.stringify(data[key]));
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error importing user data:', error);
    return false;
  }
};

/**
 * Check if local storage is available
 * @returns {boolean} - True if available, false otherwise
 */
export const isStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};