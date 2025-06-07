// src/services/youtube.js
// Service for fetching videos from YouTube API

/**
 * Search for videos on YouTube related to a query
 * @param {string} query - The search query
 * @param {Object} options - Search options
 * @param {number} options.maxResults - Maximum number of results to return (default: 5)
 * @returns {Promise<Array>} - Array of video objects
 */
export const searchVideos = async (query, options = {}) => {
  const { maxResults = 5 } = options;
  
  // In a real implementation, this would make an API call to YouTube Data API
  console.log(`Searching YouTube for: "${query}", max results: ${maxResults}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Demo implementation with mock data
  const mockVideos = [
    {
      videoId: 'abc123',
      title: `Understanding ${query} - Educational Video`,
      description: `This video explains the concept of ${query} in simple terms that anyone can understand.`,
      thumbnailUrl: 'https://i.ytimg.com/vi/placeholder/default.jpg',
      channelName: 'Learning Channel',
      viewCount: '245K',
      publishedAt: '2022-05-15'
    },
    {
      videoId: 'def456',
      title: `${query} Explained - Visual Guide`,
      description: `A comprehensive visual explanation of ${query} with animated examples.`,
      thumbnailUrl: 'https://i.ytimg.com/vi/placeholder2/default.jpg',
      channelName: 'Visual Education',
      viewCount: '1.2M',
      publishedAt: '2021-11-20'
    },
    {
      videoId: 'ghi789',
      title: `${query} for Beginners`,
      description: `Start learning about ${query} with this beginner-friendly introduction.`,
      thumbnailUrl: 'https://i.ytimg.com/vi/placeholder3/default.jpg',
      channelName: 'Beginner Academy',
      viewCount: '550K',
      publishedAt: '2023-01-10'
    },
    {
      videoId: 'jkl101',
      title: `Advanced ${query} - Deep Dive`,
      description: `Explore the advanced concepts of ${query} with detailed explanations.`,
      thumbnailUrl: 'https://i.ytimg.com/vi/placeholder4/default.jpg',
      channelName: 'Advanced Learning',
      viewCount: '320K',
      publishedAt: '2022-08-05'
    },
    {
      videoId: 'mno112',
      title: `${query} in Real Life - Practical Applications`,
      description: `See how ${query} is applied in everyday situations and real-world scenarios.`,
      thumbnailUrl: 'https://i.ytimg.com/vi/placeholder5/default.jpg',
      channelName: 'Practical Knowledge',
      viewCount: '780K',
      publishedAt: '2022-03-22'
    }
  ];
  
  return mockVideos.slice(0, maxResults);
};

/**
 * Get details for a specific YouTube video
 * @param {string} videoId - The YouTube video ID
 * @returns {Promise<Object>} - Video details object
 */
export const getVideoDetails = async (videoId) => {
  // In a real implementation, this would make an API call to YouTube Data API
  console.log(`Getting details for video ID: ${videoId}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock data
  return {
    videoId,
    title: 'Sample Video Title',
    description: 'This is a sample description for the video. It would contain details about the content.',
    thumbnailUrl: 'https://i.ytimg.com/vi/placeholder/default.jpg',
    channelName: 'Sample Channel',
    viewCount: '500K',
    publishedAt: '2022-06-15',
    tags: ['education', 'learning', 'sample'],
    duration: '10:15'
  };
};

/**
 * Get the embed URL for a YouTube video
 * @param {string} videoId - The YouTube video ID
 * @param {Object} options - Embed options
 * @param {boolean} options.autoplay - Whether to autoplay the video
 * @param {boolean} options.showControls - Whether to show video controls
 * @returns {string} - The embed URL
 */
export const getEmbedUrl = (videoId, options = {}) => {
  const { autoplay = false, showControls = true } = options;
  
  // Build the embed URL with optional parameters
  let url = `https://www.youtube.com/embed/${videoId}?rel=0`;
  
  if (autoplay) {
    url += '&autoplay=1';
  }
  
  if (!showControls) {
    url += '&controls=0';
  }
  
  return url;
};

/**
 * Find videos based on a specific topic with educational focus
 * @param {string} topic - The topic to search for
 * @param {string} educationLevel - The education level (elementary, middle, high, college)
 * @param {number} maxResults - Maximum number of results
 * @returns {Promise<Array>} - Array of relevant educational videos
 */
export const findEducationalVideos = async (topic, educationLevel = 'middle', maxResults = 3) => {
  // In a real implementation, this would use more specific search terms tailored to education
  const searchQuery = `${topic} explained ${educationLevel} school level`;
  return searchVideos(searchQuery, { maxResults });
};

/**
 * Checks if the system is using demo mode vs actual API
 * @returns {boolean} - True if using demo mode
 */
export const isUsingDemoMode = () => true;