import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { generateExplanation } from '../services/openai';
import { searchVideos, getEmbedUrl } from '../services/youtube';
import { addToSearchHistory, getSearchHistory } from '../services/storageService';
import { 
  MagnifyingGlassIcon, 
  ArrowPathIcon, 
  AcademicCapIcon,
  ClockIcon,
  BookmarkIcon,
  LightBulbIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';

function Search() {
  const [query, setQuery] = useState('');
  const [explanation, setExplanation] = useState('');
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState('middle');
  const [recentQueries, setRecentQueries] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const searchInputRef = useRef(null);
  const resultRef = useRef(null);
  
  const { currentUser } = useAuth();
  const { darkMode } = useTheme();
  
  // Update page title
  useEffect(() => {
    document.title = 'Search & Learn - Mastery.ai';
  }, []);
  
  // Load recent queries on component mount
  useEffect(() => {
    const history = getSearchHistory(5);
    setRecentQueries(history);
  }, []);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setIsLoading(true);
    setExplanation('');
    setVideos([]);
    
    try {
      // Record search in history
      const searchItem = {
        query: query.trim(),
        timestamp: new Date().toISOString(),
        gradeLevel: selectedGrade
      };
      
      addToSearchHistory(searchItem);
      
      // Update recent queries list
      setRecentQueries([searchItem, ...recentQueries.filter(item => 
        item.query !== searchItem.query
      ).slice(0, 4)]);
      
      // Get explanation from OpenAI
      const explanationText = await generateExplanation(query, selectedGrade);
      setExplanation(explanationText);
      
      // Find related videos
      const relatedVideos = await searchVideos(query, { maxResults: 3 });
      setVideos(relatedVideos);
      
      // Scroll to results
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      
    } catch (error) {
      console.error('Search error:', error);
      setExplanation('Sorry, we encountered an error processing your question. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Select a query from history
  const selectQuery = (historicalQuery) => {
    setQuery(historicalQuery.query);
    setSelectedGrade(historicalQuery.gradeLevel || 'middle');
    setShowHistory(false);
    
    // Focus on the search button
    setTimeout(() => {
      searchInputRef.current?.form?.dispatchEvent(
        new Event('submit', { cancelable: true, bubbles: true })
      );
    }, 100);
  };

  return (
    <div className="min-h-[calc(100vh-200px)]">
      {/* Search Section */}
      <section className={`py-10 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-indigo-50/50'}`}>
        <div className="max-w-4xl mx-auto px-6">
          <h1 className={`text-3xl md:text-4xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Ask Any Academic Question
          </h1>
          <p className={`text-center mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Get instant explanations tailored to your educational level
          </p>
          
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <input
                type="text"
                ref={searchInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowHistory(true)}
                onBlur={() => setTimeout(() => setShowHistory(false), 200)}
                placeholder="e.g., What is photosynthesis?"
                className={`w-full py-4 pl-5 pr-32 rounded-lg text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  darkMode
                    ? 'bg-gray-700 text-white placeholder-gray-400'
                    : 'bg-white text-gray-900 placeholder-gray-500'
                }`}
                disabled={isLoading}
              />
              
              {query.length > 0 && (
                <button
                  type="button"
                  className="absolute right-24 top-1/2 transform -translate-y-1/2 p-2"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                >
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 flex items-center"
              >
                {isLoading ? (
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                ) : (
                  <MagnifyingGlassIcon className="h-5 w-5" />
                )}
                <span className="ml-1">Search</span>
              </button>
              
              {showHistory && recentQueries.length > 0 && (
                <div className={`absolute z-10 mt-2 w-full rounded-lg shadow-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-white'
                } border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <div className={`px-4 py-2 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Recent searches
                    </p>
                  </div>
                  <ul>
                    {recentQueries.map((item, index) => (
                      <li 
                        key={index}
                        className={`px-4 py-3 hover:bg-opacity-10 hover:bg-indigo-500 cursor-pointer flex justify-between ${
                          index !== recentQueries.length - 1 ? `border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}` : ''
                        }`}
                        onClick={() => selectQuery(item)}
                      >
                        <div className="flex items-center">
                          <ClockIcon className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`} />
                          <span className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {item.query}
                          </span>
                        </div>
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {item.gradeLevel}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="mt-4 flex flex-wrap items-center justify-center md:justify-between">
              <div className="flex items-center space-x-2 mb-2 md:mb-0">
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Level:
                </span>
                {['elementary', 'middle', 'high', 'college'].map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => setSelectedGrade(grade)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedGrade === grade
                        ? 'bg-indigo-100 text-indigo-800'
                        : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`
                    }`}
                  >
                    {grade.charAt(0).toUpperCase() + grade.slice(1)}
                  </button>
                ))}
              </div>
              
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {currentUser ? 'Your questions will be saved to your history.' : 'Sign in to save your search history.'}
              </p>
            </div>
          </form>
        </div>
      </section>
      
      {/* Results Section */}
      <section className="py-8" ref={resultRef}>
        <div className="max-w-5xl mx-auto px-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Finding the best explanation...
              </p>
            </div>
          ) : explanation ? (
            <div className="grid md:grid-cols-3 gap-8">
              <div className={`md:col-span-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6`}>
                <div className="flex items-center mb-4">
                  <LightBulbIcon className="h-6 w-6 text-indigo-500 mr-2" />
                  <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Explanation
                  </h2>
                </div>
                
                <div className={`prose max-w-none ${darkMode ? 'prose-invert' : ''} prose-headings:font-semibold prose-headings:text-indigo-600`}>
                  <ReactMarkdown>
                    {explanation}
                  </ReactMarkdown>
                </div>
                
                <div className="mt-6 flex justify-between">
                  <div className="flex space-x-2">
                    <button
                      className={`flex items-center px-3 py-1 rounded-lg text-xs font-medium ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      aria-label="Save to review later"
                    >
                      <BookmarkIcon className="h-4 w-4 mr-1" />
                      Save
                    </button>
                    <button
                      className={`flex items-center px-3 py-1 rounded-lg text-xs font-medium ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      aria-label="Practice this concept"
                    >
                      <AcademicCapIcon className="h-4 w-4 mr-1" />
                      Practice
                    </button>
                  </div>
                  
                  <div className="text-xs">
                    <span className={`px-2 py-1 rounded bg-indigo-100 text-indigo-800 font-medium`}>
                      {selectedGrade} level
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-1">
                <div className={`mb-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-4`}>
                  <div className="flex items-center mb-3">
                    <QuestionMarkCircleIcon className="h-5 w-5 text-indigo-500 mr-2" />
                    <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      You asked:
                    </h3>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{query}</p>
                </div>
                
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-4`}>
                  <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Related Videos
                  </h3>
                  
                  {videos.length > 0 ? (
                    <div className="space-y-4">
                      {videos.map((video, index) => (
                        <div key={index} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} pb-4 last:border-0`}>
                          <div className="relative aspect-video mb-2 rounded overflow-hidden">
                            <img 
                              src={video.thumbnailUrl} 
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                            <a 
                              href={`https://youtube.com/watch?v=${video.videoId}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="absolute inset-0 flex items-center justify-center"
                            >
                              <div className="bg-black bg-opacity-60 rounded-full p-3">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </a>
                          </div>
                          <h4 className={`text-sm font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'} line-clamp-2`}>
                            {video.title}
                          </h4>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {video.channelName} • {video.viewCount} views
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      No related videos found.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-full mb-6`}>
                <QuestionMarkCircleIcon className="h-12 w-12 text-indigo-500" />
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Ask something to start learning
              </h2>
              <p className={`max-w-md ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Type any academic question above to get an instant, personalized explanation.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Search;