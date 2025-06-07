import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { generateProblems, verifyAnswer, adjustDifficulty } from '../services/practiceGenerator';
import { savePracticeResult, getPreferences } from '../services/storageService';
import { 
  AcademicCapIcon, 
  ArrowPathIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  LightBulbIcon,
  DocumentTextIcon,
  AdjustmentsHorizontalIcon,
  ChevronDoubleRightIcon
} from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';

function Practice() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [problems, setProblems] = useState([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState(null); // null, 'correct', 'incorrect'
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [difficulty, setDifficulty] = useState('middle'); // elementary, middle, high
  const [count, setCount] = useState(5);
  const [progress, setProgress] = useState({ correct: 0, total: 0 });
  const [topicSuggestions, setTopicSuggestions] = useState([
    'Photosynthesis', 'Quadratic Equations', 'US Constitution', 
    'Chemical Reactions', 'Shakespeare', 'World War II'
  ]);
  
  const { currentUser } = useAuth();
  const { darkMode } = useTheme();
  const answerInputRef = useRef(null);
  
  // Update page title
  useEffect(() => {
    document.title = 'Practice Problems - Mastery.ai';
    
    // Load user preferences
    const preferences = getPreferences();
    if (preferences?.difficulty) {
      setDifficulty(preferences.difficulty);
    }
  }, []);
  
  // Get current problem
  const currentProblem = problems.length > 0 && currentProblemIndex < problems.length 
    ? problems[currentProblemIndex] 
    : null;
  
  // Handle topic submission
  const handleSubmitTopic = async (e) => {
    e.preventDefault();
    
    if (!topic.trim()) return;
    
    setLoading(true);
    setProblems([]);
    setCurrentProblemIndex(0);
    setUserAnswer('');
    setResult(null);
    setShowExplanation(false);
    setShowHint(false);
    setCurrentHintIndex(0);
    setProgress({ correct: 0, total: 0 });
    
    try {
      // Generate problems based on topic and difficulty
      const generatedProblems = await generateProblems(topic, difficulty, count);
      setProblems(generatedProblems);
    } catch (error) {
      console.error('Error generating problems:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle answer submission
  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    
    if (!userAnswer.trim() || !currentProblem) return;
    
    // Check answer
    const isCorrect = verifyAnswer(currentProblem, userAnswer);
    
    // Set result
    setResult(isCorrect ? 'correct' : 'incorrect');
    
    // Update progress
    const newProgress = { 
      correct: progress.correct + (isCorrect ? 1 : 0), 
      total: progress.total + 1 
    };
    setProgress(newProgress);
    
    // Save result to storage
    savePracticeResult({
      problemId: currentProblem.problemId,
      conceptId: currentProblem.conceptId,
      topic: topic,
      difficulty: currentProblem.difficulty,
      correct: isCorrect,
      userAnswer: userAnswer,
      timestamp: new Date().toISOString()
    });
  };
  
  // Move to next problem
  const handleNextProblem = () => {
    // Calculate performance for adaptive difficulty
    if (currentProblemIndex === problems.length - 1) {
      const performance = progress.correct / progress.total;
      const newDifficulty = adjustDifficulty(performance);
      
      // Update difficulty if changed
      if (newDifficulty !== difficulty) {
        setDifficulty(newDifficulty);
      }
    }
    
    // Reset state for next problem
    setUserAnswer('');
    setResult(null);
    setShowExplanation(false);
    setShowHint(false);
    setCurrentHintIndex(0);
    
    // Move to next problem or back to topic selection if done
    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(current => current + 1);
    } else {
      // All problems completed
      setProblems([]);
    }
    
    // Focus on the answer input for the next problem
    setTimeout(() => {
      answerInputRef.current?.focus();
    }, 100);
  };
  
  // Show the next hint
  const showNextHint = () => {
    if (!showHint) {
      setShowHint(true);
    } else if (currentProblem && currentHintIndex < currentProblem.hints.length - 1) {
      setCurrentHintIndex(current => current + 1);
    }
  };
  
  // Handle topic suggestion click
  const handleSuggestionClick = (suggestion) => {
    setTopic(suggestion);
    
    // Submit the form with the selected topic
    setTimeout(() => {
      document.getElementById('topic-form').dispatchEvent(
        new Event('submit', { cancelable: true, bubbles: true })
      );
    }, 100);
  };
  
  return (
    <div className="min-h-[calc(100vh-200px)]">
      {/* Practice Setup Section */}
      {!loading && problems.length === 0 && (
        <section className={`py-10 ${darkMode ? 'bg-gray-800/50' : 'bg-indigo-50/50'} rounded-xl`}>
          <div className="max-w-4xl mx-auto px-6">
            <h1 className={`text-3xl md:text-4xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Practice Problems
            </h1>
            <p className={`text-center mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Generate custom practice problems on any academic topic
            </p>
            
            <form id="topic-form" onSubmit={handleSubmitTopic} className="max-w-xl mx-auto">
              <div className="mb-6">
                <label 
                  htmlFor="topic" 
                  className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
                >
                  What would you like to practice?
                </label>
                <input
                  id="topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Photosynthesis, Quadratic Equations"
                  className={`w-full py-3 px-4 rounded-lg text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    darkMode
                      ? 'bg-gray-700 text-white placeholder-gray-400'
                      : 'bg-white text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
              
              <div className="mb-6">
                <label 
                  className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
                >
                  Difficulty Level
                </label>
                <div className="flex space-x-2">
                  {['elementary', 'middle', 'high'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setDifficulty(level)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                        difficulty === level
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200' 
                          : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-8">
                <label 
                  className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
                >
                  Number of Problems
                </label>
                <div className="flex space-x-2">
                  {[3, 5, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCount(num)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                        count === num
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200' 
                          : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={!topic.trim()}
                  className="px-8 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg disabled:bg-gray-400"
                >
                  <AcademicCapIcon className="h-5 w-5 inline-block mr-2" />
                  Generate Problems
                </button>
              </div>
            </form>
            
            {/* Topic Suggestions */}
            <div className="mt-12">
              <h2 className={`text-lg font-medium mb-4 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Popular Topics
              </h2>
              <div className="flex flex-wrap justify-center gap-2">
                {topicSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      darkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    } shadow-sm`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Generating practice problems for {topic}...
          </p>
        </div>
      )}
      
      {/* Practice Problem */}
      {!loading && currentProblem && (
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-6">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <DocumentTextIcon className="h-5 w-5 text-indigo-500 mr-2" />
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Topic: {topic}
                  </span>
                </div>
                <div className="flex items-center">
                  <AdjustmentsHorizontalIcon className="h-5 w-5 text-indigo-500 mr-2" />
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} level
                  </span>
                </div>
              </div>
              
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${
                      darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                    }`}>
                      Problem {currentProblemIndex + 1} of {problems.length}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-semibold inline-block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {Math.round((progress.correct / Math.max(progress.total, 1)) * 100)}% correct
                    </span>
                  </div>
                </div>
                <div className={`overflow-hidden h-2 mb-4 text-xs flex rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    style={{ width: `${(currentProblemIndex / problems.length) * 100}%` }} 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Problem Card */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 mb-8`}>
              <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {currentProblem.problemText}
              </h2>
              
              {/* Multiple Choice Options */}
              {currentProblem.options && currentProblem.options.length > 0 && (
                <div className="mb-6">
                  <div className="space-y-3">
                    {currentProblem.options.map((option, index) => (
                      <div key={index}>
                        <label className={`flex items-center p-3 rounded-lg cursor-pointer ${
                          userAnswer === option
                            ? darkMode
                              ? 'bg-indigo-900/30 border border-indigo-700'
                              : 'bg-indigo-50 border border-indigo-200'
                            : darkMode
                              ? 'bg-gray-700 hover:bg-gray-650'
                              : 'bg-gray-50 hover:bg-gray-100'
                        }`}>
                          <input
                            type="radio"
                            name="answer"
                            value={option}
                            checked={userAnswer === option}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            disabled={result !== null}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                          />
                          <span className={`ml-3 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                            {option}
                          </span>
                          
                          {/* Show check/X mark when result is available */}
                          {result !== null && option === currentProblem.correctAnswer && (
                            <CheckCircleIcon className="h-5 w-5 ml-auto text-green-500" />
                          )}
                          {result !== null && userAnswer === option && option !== currentProblem.correctAnswer && (
                            <XCircleIcon className="h-5 w-5 ml-auto text-red-500" />
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Text input for non-multiple choice */}
              {(!currentProblem.options || currentProblem.options.length === 0) && (
                <form onSubmit={handleSubmitAnswer} className="mb-6">
                  <div>
                    <label 
                      htmlFor="answer" 
                      className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      Your Answer:
                    </label>
                    <input
                      id="answer"
                      ref={answerInputRef}
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      disabled={result !== null}
                      className={`w-full py-2 px-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        darkMode
                          ? 'bg-gray-700 text-white'
                          : 'bg-white text-gray-900'
                      } border ${
                        result === 'correct'
                          ? 'border-green-500'
                          : result === 'incorrect'
                            ? 'border-red-500'
                            : darkMode ? 'border-gray-600' : 'border-gray-300'
                      }`}
                    />
                    
                    {/* Show correct answer when wrong */}
                    {result === 'incorrect' && (
                      <p className="mt-2 text-sm text-red-500 flex items-start">
                        <XCircleIcon className="h-5 w-5 mr-1 flex-shrink-0" />
                        <span>The correct answer is: <strong>{currentProblem.correctAnswer}</strong></span>
                      </p>
                    )}
                    {result === 'correct' && (
                      <p className="mt-2 text-sm text-green-500 flex items-center">
                        <CheckCircleIcon className="h-5 w-5 mr-1" />
                        <span>Correct!</span>
                      </p>
                    )}
                  </div>
                </form>
              )}
              
              {/* Hint Section */}
              {showHint && currentProblem.hints && currentProblem.hints.length > 0 && (
                <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-yellow-50'}`}>
                  <div className="flex items-start">
                    <LightBulbIcon className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        Hint {currentHintIndex + 1}:
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {currentProblem.hints[currentHintIndex]}
                      </p>
                      
                      {/* Show button for next hint if available */}
                      {currentHintIndex < currentProblem.hints.length - 1 && (
                        <button 
                          type="button"
                          onClick={showNextHint}
                          className={`mt-2 text-xs flex items-center ${
                            darkMode ? 'text-yellow-300 hover:text-yellow-200' : 'text-yellow-700 hover:text-yellow-800'
                          }`}
                        >
                          Show next hint
                          <ChevronDoubleRightIcon className="h-3 w-3 ml-1" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Explanation (when answered) */}
              {showExplanation && result !== null && (
                <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
                  <h3 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    Explanation:
                  </h3>
                  <div className={`prose prose-sm max-w-none ${darkMode ? 'prose-invert' : ''}`}>
                    <ReactMarkdown>
                      {currentProblem.explanation}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-2">
                  {/* Hint button */}
                  {!showHint && currentProblem.hints && currentProblem.hints.length > 0 && (
                    <button
                      type="button"
                      onClick={showNextHint}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        darkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <LightBulbIcon className="h-4 w-4 inline-block mr-1" />
                      Show Hint
                    </button>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {/* Check Answer button (for multiple choice) */}
                  {currentProblem.options && currentProblem.options.length > 0 && result === null && (
                    <button
                      type="button"
                      onClick={handleSubmitAnswer}
                      disabled={!userAnswer}
                      className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:bg-gray-400"
                    >
                      Check Answer
                    </button>
                  )}
                  
                  {/* Submit button (for text input) */}
                  {(!currentProblem.options || currentProblem.options.length === 0) && result === null && (
                    <button
                      type="button"
                      onClick={handleSubmitAnswer}
                      disabled={!userAnswer.trim()}
                      className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:bg-gray-400"
                    >
                      Submit Answer
                    </button>
                  )}
                  
                  {/* Show Explanation button (after answering) */}
                  {result !== null && !showExplanation && (
                    <button
                      type="button"
                      onClick={() => setShowExplanation(true)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        darkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Show Explanation
                    </button>
                  )}
                  
                  {/* Next Problem button */}
                  {result !== null && (
                    <button
                      type="button"
                      onClick={handleNextProblem}
                      className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
                    >
                      {currentProblemIndex < problems.length - 1 ? 'Next Problem' : 'Finish Practice'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Practice Complete */}
      {!loading && problems.length > 0 && !currentProblem && (
        <section className="py-12">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <div className={`mb-8 p-3 rounded-full inline-block ${darkMode ? 'bg-indigo-900/30' : 'bg-indigo-100'}`}>
              <CheckCircleIcon className="h-12 w-12 text-indigo-500" />
            </div>
            
            <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Practice Complete!
            </h2>
            
            <p className={`mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              You answered {progress.correct} out of {progress.total} questions correctly.
            </p>
            
            <div className="mb-12">
              <div className="relative pt-1 w-full max-w-md mx-auto">
                <div className={`overflow-hidden h-6 text-xs flex rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    style={{ width: `${Math.round((progress.correct / Math.max(progress.total, 1)) * 100)}%` }} 
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                      progress.correct / progress.total > 0.7 
                        ? 'bg-green-500' 
                        : progress.correct / progress.total > 0.4 
                          ? 'bg-yellow-500' 
                          : 'bg-red-500'
                    }`}
                  >
                    {Math.round((progress.correct / Math.max(progress.total, 1)) * 100)}%
                  </div>
                </div>
              </div>
              
              <p className={`mt-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Based on your performance, we recommend {difficulty} level problems for your next practice.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => handleSuggestionClick(topic)}
                className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
              >
                <ArrowPathIcon className="h-5 w-5 inline-block mr-2" />
                Practice Again
              </button>
              
              <button
                onClick={() => {
                  setTopic('');
                  setProblems([]);
                }}
                className={`px-6 py-3 rounded-lg font-medium ${darkMode 
                  ? 'bg-gray-800 text-white hover:bg-gray-700' 
                  : 'bg-white text-indigo-600 hover:bg-gray-50'} border border-gray-300 shadow-md hover:shadow-lg transition-colors`}
              >
                Try New Topic
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default Practice;