// src/services/youtube.js
// Service for fetching videos from YouTube API

/**
 * Search for videos on YouTube related to a query
 * @param {string} query - The search query
 * @param {Object} options - Search options
 * @param {number} options.maxResults - Maximum number of results to return (default: 5)
 * @returns {Promise<Array>} - Array of video objects
 */
const youtubeApiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

const formatViewCount = (count) => {
  if (!count) return 'N/A';
  const value = Number(count);
  if (Number.isNaN(value)) return 'N/A';
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
};

const getMockVideos = (query) => [
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

export const searchVideos = async (query, options = {}) => {
  const { maxResults = 5 } = options;

  if (!youtubeApiKey) {
    console.warn('YouTube API key is missing. Falling back to mock data.');
    return getMockVideos(query).slice(0, maxResults);
  }

  const searchParams = new URLSearchParams({
    key: youtubeApiKey,
    q: query,
    part: 'snippet',
    type: 'video',
    maxResults: String(maxResults),
    safeSearch: 'moderate',
    relevanceLanguage: 'en'
  });

  const searchResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?${searchParams.toString()}`);

  if (!searchResponse.ok) {
    const errorBody = await searchResponse.json().catch(() => ({}));
    console.error('YouTube search error:', errorBody);
    throw new Error('Failed to fetch YouTube videos. Please try again later.');
  }

  const searchData = await searchResponse.json();
  const videoIds = (searchData.items || [])
    .map((item) => item?.id?.videoId)
    .filter(Boolean);

  if (videoIds.length === 0) {
    return [];
  }

  const detailsParams = new URLSearchParams({
    key: youtubeApiKey,
    id: videoIds.join(','),
    part: 'snippet,statistics,contentDetails'
  });

  const detailsResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?${detailsParams.toString()}`);

  if (!detailsResponse.ok) {
    const errorBody = await detailsResponse.json().catch(() => ({}));
    console.error('YouTube details error:', errorBody);
    throw new Error('Failed to fetch YouTube video details. Please try again later.');
  }

  const detailsData = await detailsResponse.json();
  const detailsById = new Map(
    (detailsData.items || []).map((item) => [item.id, item])
  );

  return (searchData.items || []).map((item) => {
    const details = detailsById.get(item?.id?.videoId);
    return {
      videoId: item?.id?.videoId,
      title: item?.snippet?.title || 'Untitled video',
      description: item?.snippet?.description || '',
      thumbnailUrl:
        item?.snippet?.thumbnails?.medium?.url ||
        item?.snippet?.thumbnails?.default?.url ||
        '',
      channelName: item?.snippet?.channelTitle || 'Unknown channel',
      viewCount: formatViewCount(details?.statistics?.viewCount),
      publishedAt: item?.snippet?.publishedAt || ''
    };
  });
};

/**
 * Get details for a specific YouTube video
 * @param {string} videoId - The YouTube video ID
 * @returns {Promise<Object>} - Video details object
 */
export const getVideoDetails = async (videoId) => {
  if (!youtubeApiKey) {
    console.warn('YouTube API key is missing. Falling back to mock data.');
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
  }

  const params = new URLSearchParams({
    key: youtubeApiKey,
    id: videoId,
    part: 'snippet,statistics,contentDetails'
  });

  const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?${params.toString()}`);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    console.error('YouTube details error:', errorBody);
    throw new Error('Failed to fetch YouTube video details.');
  }

  const data = await response.json();
  const item = data.items?.[0];

  if (!item) {
    throw new Error('Video not found.');
  }

  return {
    videoId,
    title: item?.snippet?.title || 'Untitled video',
    description: item?.snippet?.description || '',
    thumbnailUrl:
      item?.snippet?.thumbnails?.high?.url ||
      item?.snippet?.thumbnails?.medium?.url ||
      '',
    channelName: item?.snippet?.channelTitle || 'Unknown channel',
    viewCount: formatViewCount(item?.statistics?.viewCount),
    publishedAt: item?.snippet?.publishedAt || '',
    tags: item?.snippet?.tags || [],
    duration: item?.contentDetails?.duration || ''
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
export const isUsingDemoMode = () => !youtubeApiKey;