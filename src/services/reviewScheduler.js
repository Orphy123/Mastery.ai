// src/services/reviewScheduler.js
// Service for implementing spaced repetition

/**
 * Determine if a review item is due for review
 * @param {Object} item - The review item
 * @returns {boolean} - True if due for review, false otherwise
 */
export const isDueForReview = (item) => {
  // If item has no next review date, it's due immediately
  if (!item.nextReviewDate) {
    return true;
  }
  
  const now = new Date();
  const nextReviewDate = new Date(item.nextReviewDate);
  
  // If next review date is in the past or today, it's due
  return nextReviewDate <= now;
};

/**
 * Calculate the next review date based on spaced repetition algorithm
 * @param {number} quality - The quality of recall (0-5, with 5 being perfect)
 * @param {number} interval - The current interval in days
 * @param {number} ease - The ease factor (starts at 2.5)
 * @returns {Object} - The new interval, ease, and next review date
 */
export const calculateNextReview = (quality, interval = 1, ease = 2.5) => {
  // Implementation of SuperMemo 2 algorithm
  
  // Ensure quality is between 0 and 5
  quality = Math.max(0, Math.min(5, quality));
  
  // Default ease if not provided
  if (!ease) ease = 2.5;
  
  // Adjust the ease factor
  const newEase = Math.max(1.3, ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  
  // Calculate the new interval
  let newInterval;
  
  if (quality < 3) {
    // If quality is less than 3, reset interval to 1 day
    newInterval = 1;
  } else if (!interval || interval < 1) {
    // First successful review
    newInterval = 1;
  } else if (interval === 1) {
    // Second successful review
    newInterval = 6;
  } else {
    // Subsequent successful reviews
    newInterval = Math.round(interval * newEase);
  }
  
  // Calculate the next review date
  const now = new Date();
  const nextReviewDate = new Date(now);
  nextReviewDate.setDate(now.getDate() + newInterval);
  
  return {
    interval: newInterval,
    ease: newEase,
    nextReviewDate: nextReviewDate.toISOString()
  };
};

/**
 * Create a new review item
 * @param {string} concept - The concept to be reviewed
 * @param {string} prompt - The prompt question
 * @param {string} level - Educational level
 * @returns {Object} - A new review item
 */
export const createReviewItem = (concept, prompt, level = 'middle') => {
  const now = new Date();
  const id = `review-${concept.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
  
  return {
    id,
    concept, // The concept or answer
    prompt, // The question or prompt
    level, // Educational level
    interval: 0, // Current interval in days
    ease: 2.5, // Ease factor (starts at 2.5)
    reviewCount: 0, // Number of times reviewed
    createdAt: now.toISOString(),
    lastReviewedAt: null,
    nextReviewDate: now.toISOString() // Due immediately by default
  };
};

/**
 * Generate a review schedule for multiple items
 * @param {Array} items - Array of review items
 * @returns {Object} - Object with dates as keys and arrays of items as values
 */
export const generateReviewSchedule = (items) => {
  const schedule = {};
  
  if (!items || !items.length) return schedule;
  
  items.forEach(item => {
    if (!item.nextReviewDate) return;
    
    const dateStr = new Date(item.nextReviewDate).toDateString();
    
    if (!schedule[dateStr]) {
      schedule[dateStr] = [];
    }
    
    schedule[dateStr].push(item);
  });
  
  return schedule;
};

/**
 * Calculate memory strength based on review history
 * @param {Object} item - The review item
 * @returns {number} - Memory strength as a percentage (0-100)
 */
export const calculateMemoryStrength = (item) => {
  if (!item) return 0;
  
  // If never reviewed, strength is 0
  if (!item.reviewCount || item.reviewCount === 0) {
    return 0;
  }
  
  // Calculate days since creation
  const createdDate = new Date(item.createdAt);
  const now = new Date();
  const daysSinceCreation = Math.max(1, Math.floor((now - createdDate) / (1000 * 60 * 60 * 24)));
  
  // Calculate average interval
  const avgInterval = item.interval / item.reviewCount;
  
  // Base strength on the ratio of interval to days since creation, capped at 100%
  const rawStrength = Math.min(100, (avgInterval / daysSinceCreation) * 100 * item.ease);
  
  // Adjust strength based on time since last review
  if (item.lastReviewedAt) {
    const lastReviewDate = new Date(item.lastReviewedAt);
    const daysSinceLastReview = Math.floor((now - lastReviewDate) / (1000 * 60 * 60 * 24));
    
    // Decay factor based on days since last review relative to interval
    const decayFactor = Math.max(0, 1 - (daysSinceLastReview / (item.interval || 1)));
    
    // Apply decay
    return Math.round(rawStrength * decayFactor);
  }
  
  return Math.round(rawStrength);
};

/**
 * Sort review items by due date
 * @param {Array} items - Array of review items
 * @returns {Array} - Sorted array of review items
 */
export const sortReviewItemsByDueDate = (items) => {
  if (!items || !items.length) return [];
  
  return [...items].sort((a, b) => {
    const dateA = a.nextReviewDate ? new Date(a.nextReviewDate) : new Date(0);
    const dateB = b.nextReviewDate ? new Date(b.nextReviewDate) : new Date(0);
    return dateA - dateB;
  });
};

/**
 * Get statistics for a set of review items
 * @param {Array} items - Array of review items
 * @returns {Object} - Statistics object
 */
export const getReviewStats = (items) => {
  if (!items || !items.length) {
    return {
      totalItems: 0,
      dueCount: 0,
      reviewedToday: 0,
      averageInterval: 0,
      averageStrength: 0
    };
  }
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  let dueCount = 0;
  let reviewedToday = 0;
  let totalInterval = 0;
  let totalStrength = 0;
  
  items.forEach(item => {
    // Count due items
    if (isDueForReview(item)) {
      dueCount++;
    }
    
    // Count items reviewed today
    if (item.lastReviewedAt) {
      const lastReviewDate = new Date(item.lastReviewedAt);
      if (lastReviewDate >= today) {
        reviewedToday++;
      }
    }
    
    // Sum intervals and strengths
    totalInterval += item.interval || 0;
    totalStrength += calculateMemoryStrength(item);
  });
  
  return {
    totalItems: items.length,
    dueCount,
    reviewedToday,
    averageInterval: items.length > 0 ? Math.round(totalInterval / items.length * 10) / 10 : 0,
    averageStrength: items.length > 0 ? Math.round(totalStrength / items.length) : 0
  };
};