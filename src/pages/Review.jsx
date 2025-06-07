import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  isDueForReview, 
  calculateNextReview, 
  createReviewItem 
} from '../services/reviewScheduler';
import { 
  getReviewItems, 
  saveReviewItem, 
  getSearchHistory
} from '../services/storageService';
import { generateExplanation } from '../services/openai';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  BookmarkIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  CalendarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';

function Review() {
  const [reviewItems, setReviewItems] = useState([]);
  const [dueItems, setDueItems] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [userResponse, setUserResponse] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanationLoading, setExplanationLoading] = useState(false);
  const responseRef = useRef(null);
  
  const { currentUser } = useAuth();
  const { darkMode } = useTheme();
  
  // Update page title
  useEffect(() => {
    document.title = 'Review & Retain - Mastery.ai';
  }, []);
  
  // Load review items
  useEffect(() => {
    const loadReviewItems = async () => {
      try {
        setLoading(true);
        
        // Get review items from storage
        let items = getReviewItems();
        
        // If no review items, create some from search history
        if (items.length === 0) {
          items = await createReviewItemsFromHistory();
        }
        
        // Filter for due items
        const due = items.filter(item => isDueForReview(item));
        
        setReviewItems(items);
        setDueItems(due);
        
        // Set current item if due items exist
        if (due.length > 0) {
          setCurrentItem(due[0]);
        }
      } catch (error) {
        console.error('Error loading review items:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadReviewItems();
  }, []);
  
  // Create review items from search history if none exist
  const createReviewItemsFromHistory = async () => {
    const searchHistory = getSearchHistory();
    const uniqueQueries = [...new Set(searchHistory.map(item => item.query))].slice(0, 10);
    
    const newItems = uniqueQueries.map(query => {
      // Create a review item for each unique query
      return createReviewItem(
        query,
        `What is ${query}?`,
        'middle'
      );
    });
    
    // Save all new items
    newItems.forEach(item => saveReviewItem(item));
    
    return newItems;
  };
  
  // Handle submit response
  const handleSubmitResponse = () => {
    if (!userResponse.trim() || !currentItem) return;
    
    setShowAnswer(true);
  };
  
  // Handle rating (spaced repetition quality score)
  const handleRating = async (score) => {
    if (!currentItem) return;
    
    setRating(score);
    setHasReviewed(true);
    
    // Calculate next review date
    const nextReview = calculateNextReview(score, currentItem.interval, currentItem.ease);
    
    // Update the current item
    const updatedItem = {
      ...currentItem,
      interval: nextReview.interval,
      ease: nextReview.ease,
      nextReviewDate: nextReview.nextReviewDate,
      reviewCount: (currentItem.reviewCount || 0) + 1,
      lastReviewedAt: new Date().toISOString()
    };
    
    // Save the updated item
    saveReviewItem(updatedItem);
    
    // Update the items in state
    const updatedItems = reviewItems.map(item => 
      item.id === currentItem.id ? updatedItem : item
    );
    setReviewItems(updatedItems);
    
    // Update due items
    const remainingDue = dueItems.filter(item => item.id !== currentItem.id);
    setDueItems(remainingDue);
  };
  
  // Move to next item
  const handleNextItem = () => {
    // Clear state for next item
    setUserResponse('');
    setShowAnswer(false);
    setRating(null);
    setHasReviewed(false);
    setExplanation('');
    setShowExplanation(false);
    
    // Get next due item
    const remainingDue = dueItems.filter(item => item.id !== currentItem.id);
    
    if (remainingDue.length > 0) {
      setCurrentItem(remainingDue[0]);
    } else {
      setCurrentItem(null);
    }
    
    // Focus on response input
    setTimeout(() => {
      responseRef.current?.focus();
    }, 100);
  };
  
  // Get explanation for the concept
  const getExplanation = async () => {
    if (!currentItem || explanation) return;
    
    setExplanationLoading(true);
    
    try {
      const result = await generateExplanation(currentItem.concept);
      setExplanation(result);
      setShowExplanation(true);
    } catch (error) {
      console.error('Error getting explanation:', error);
    } finally {
      setExplanationLoading(false);
    }
  };
  
  // Create new review items
  const handleCreateNewItem = () => {
    // Implement a modal or form to create new review items
    // For now, we'll just create a sample item
    const newItem = createReviewItem(
      'Sample Review Item',
      'What is the key concept here?',
      'middle'
    );
    
    saveReviewItem(newItem);
    
    // Update state with the new item
    const updatedItems = [...reviewItems, newItem];
    setReviewItems(updatedItems);
    
    // If it's due for review, add to due items
    if (isDueForReview(newItem)) {
      const updatedDue = [...dueItems, newItem];
      setDueItems(updatedDue);
      
      // If no current item, set this as current
      if (!currentItem) {
        setCurrentItem(newItem);
      }
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };
  
  // Quality ratings display elements
  const qualityRatings = [
    { score: 0, label: "Forgot", color: "bg-red-500" },
    { score: 1, label: "Hard", color: "bg-orange-500" },
    { score: 2, label: "Difficult", color: "bg-yellow-500" },
    { score: 3, label: "Moderate", color: "bg-blue-500" },
    { score: 4, label: "Easy", color: "bg-green-500" },
    { score: 5, label: "Perfect", color: "bg-indigo-500" }
  ];
  
  return (
    <div className="min-h-[calc(100vh-200px)]">
      {/* Header Section */}
      <section className={`py-10 ${darkMode ? 'bg-gray-800/50' : 'bg-indigo-50/50'} rounded-xl`}>
        <div className="max-w-4xl mx-auto px-6">
          <h1 className={`text-3xl md:text-4xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Spaced Repetition Review
          </h1>
          <p className={`text-center mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Strengthen your memory with optimally timed reviews
          </p>
          
          <div className="flex justify-center mb-6">
            <div className={`inline-flex items-center px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow`}>
              <ClockIcon className="h-5 w-5 text-indigo-500 mr-2" />
              <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {dueItems.length} {dueItems.length === 1 ? 'item' : 'items'} due for review
              </span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading your review items...
          </p>
        </div>
      )}
      
      {/* Review Card */}
      {!loading && currentItem && (
        <section className="py-8">
          <div className="max-w-3xl mx-auto px-6">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 mb-8`}>
              {/* Review Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-indigo-500 mr-2" />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Review #{currentItem.reviewCount + 1}
                  </span>
                </div>
                <div className={`text-xs px-3 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                  {currentItem.concept.length > 30 ? `${currentItem.concept.substring(0, 30)}...` : currentItem.concept}
                </div>
              </div>
              
              {/* Prompt */}
              <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {currentItem.prompt}
              </h2>
              
              {/* Response Input */}
              {!showAnswer && (
                <div className="mb-6">
                  <label 
                    htmlFor="response" 
                    className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    Your Response:
                  </label>
                  <textarea
                    id="response"
                    ref={responseRef}
                    value={userResponse}
                    onChange={(e) => setUserResponse(e.target.value)}
                    rows={3}
                    className={`w-full py-2 px-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode
                        ? 'bg-gray-700 text-white border-gray-600'
                        : 'bg-white text-gray-900 border-gray-300'
                    } border`}
                    placeholder="Write your answer here..."
                  />
                  
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleSubmitResponse}
                      disabled={!userResponse.trim()}
                      className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:bg-gray-400"
                    >
                      Check Answer
                    </button>
                  </div>
                </div>
              )}
              
              {/* Answer and Rating */}
              {showAnswer && (
                <>
                  <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
                    <h3 className={`text-md font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      Concept Answer:
                    </h3>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {currentItem.concept}
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                    <h3 className={`text-md font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      Your Response:
                    </h3>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {userResponse}
                    </p>
                  </div>
                  
                  {!hasReviewed && (
                    <div className="mb-6">
                      <h3 className={`text-md font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        How well did you remember this?
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {qualityRatings.map((item) => (
                          <button
                            key={item.score}
                            onClick={() => handleRating(item.score)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium text-white ${item.color} hover:opacity-90`}
                          >
                            {item.score}: {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {hasReviewed && (
                    <div className="mb-6">
                      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <ClockIcon className="h-5 w-5 text-green-500 mr-2" />
                            <span className={`${darkMode ? 'text-gray-200' : 'text-gray-800'} font-medium`}>
                              Next review:
                            </span>
                          </div>
                          <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {currentItem.nextReviewDate ? formatDate(currentItem.nextReviewDate) : 'Not scheduled'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              
              {/* Explanation Section */}
              {showAnswer && (
                <div className="mb-6">
                  {!showExplanation && !explanation && (
                    <button
                      onClick={getExplanation}
                      disabled={explanationLoading}
                      className={`w-full py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center ${
                        darkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {explanationLoading ? (
                        <>
                          <ArrowPathIcon className="h-4 w-4 animate-spin mr-2" />
                          Loading explanation...
                        </>
                      ) : (
                        <>
                          <DocumentTextIcon className="h-4 w-4 mr-2" />
                          Get detailed explanation
                        </>
                      )}
                    </button>
                  )}
                  
                  {showExplanation && explanation && (
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-yellow-50'}`}>
                      <h3 className={`text-md font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'} flex items-center`}>
                        <DocumentTextIcon className="h-4 w-4 mr-2" />
                        Detailed Explanation:
                      </h3>
                      <div className={`prose max-w-none ${darkMode ? 'prose-invert' : ''} prose-sm`}>
                        <ReactMarkdown>
                          {explanation}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex justify-between">
                <div></div>
                <div>
                  {hasReviewed && (
                    <button
                      onClick={handleNextItem}
                      className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
                    >
                      {dueItems.length > 1 ? 'Next Item' : 'Finish Review'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Empty State - No Due Items */}
      {!loading && (!reviewItems.length || (!currentItem && dueItems.length === 0)) && (
        <section className="py-12">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <div className={`mb-8 p-3 rounded-full inline-block ${darkMode ? 'bg-indigo-900/30' : 'bg-indigo-100'}`}>
              <CheckCircleIcon className="h-12 w-12 text-indigo-500" />
            </div>
            
            <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {reviewItems.length ? 'All caught up!' : 'No review items yet'}
            </h2>
            
            <p className={`mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {reviewItems.length 
                ? 'You have no more items due for review today. Check back later!'
                : 'Create your first review item to get started with spaced repetition.'
              }
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleCreateNewItem}
                className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
              >
                <BookmarkIcon className="h-5 w-5 inline-block mr-2" />
                {reviewItems.length ? 'Create New Review Item' : 'Get Started'}
              </button>
              
              {reviewItems.length > 0 && (
                <Link
                  to="/search"
                  className={`px-6 py-3 rounded-lg font-medium ${darkMode 
                    ? 'bg-gray-800 text-white hover:bg-gray-700' 
                    : 'bg-white text-indigo-600 hover:bg-gray-50'} border border-gray-300 shadow-md hover:shadow-lg transition-colors`}
                >
                  Back to Search
                </Link>
              )}
            </div>
            
            {reviewItems.length > 0 && (
              <div className="mt-10">
                <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Upcoming Reviews
                </h3>
                
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md overflow-hidden`}>
                  <table className="min-w-full">
                    <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <tr>
                        <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                          Concept
                        </th>
                        <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                          Next Review
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {reviewItems
                        .filter(item => !isDueForReview(item))
                        .sort((a, b) => new Date(a.nextReviewDate) - new Date(b.nextReviewDate))
                        .slice(0, 5)
                        .map((item, index) => (
                          <tr key={index}>
                            <td className={`px-6 py-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {item.concept.length > 30 ? `${item.concept.substring(0, 30)}...` : item.concept}
                            </td>
                            <td className={`px-6 py-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {formatDate(item.nextReviewDate)}
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default Review;