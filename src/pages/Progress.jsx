import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  getStudyStats, 
  getPracticeResults, 
  getConceptMastery,
  getSearchHistory
} from '../services/storageService';
import { 
  ChartBarIcon, 
  ClockIcon,
  AcademicCapIcon,
  TrophyIcon,
  FireIcon,
  CalendarIcon,
  BookOpenIcon,
  DocumentTextIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

function Progress() {
  const [stats, setStats] = useState(null);
  const [practiceResults, setPracticeResults] = useState([]);
  const [conceptMastery, setConceptMastery] = useState({});
  const [searchHistory, setSearchHistory] = useState([]);
  const [timeRange, setTimeRange] = useState('week'); // week, month, all
  const [loading, setLoading] = useState(true);
  
  const { currentUser } = useAuth();
  const { darkMode } = useTheme();
  
  // Update page title
  useEffect(() => {
    document.title = 'Progress Tracking - Mastery.ai';
  }, []);
  
  // Load user data
  useEffect(() => {
    const loadUserData = () => {
      try {
        setLoading(true);
        
        // Get study statistics
        const studyStats = getStudyStats();
        setStats(studyStats);
        
        // Get practice results
        const results = getPracticeResults();
        setPracticeResults(results);
        
        // Get concept mastery data
        const mastery = getConceptMastery();
        setConceptMastery(mastery);
        
        // Get search history
        const history = getSearchHistory();
        setSearchHistory(history);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, []);
  
  // Filter data based on time range
  const filterByTimeRange = (data) => {
    if (!data || !data.length || timeRange === 'all') return data;
    
    const now = new Date();
    let cutoff = new Date();
    
    if (timeRange === 'week') {
      cutoff.setDate(now.getDate() - 7);
    } else if (timeRange === 'month') {
      cutoff.setMonth(now.getMonth() - 1);
    }
    
    return data.filter(item => {
      const itemDate = new Date(item.timestamp);
      return itemDate >= cutoff;
    });
  };
  
  // Get filtered practice results
  const filteredPracticeResults = filterByTimeRange(practiceResults);
  
  // Calculate practice accuracy
  const practiceAccuracy = filteredPracticeResults.length > 0
    ? Math.round((filteredPracticeResults.filter(r => r.correct).length / filteredPracticeResults.length) * 100)
    : 0;
  
  // Get top concepts by mastery
  const topConcepts = Object.entries(conceptMastery)
    .map(([id, data]) => ({
      id,
      name: id.split('-').slice(1).join(' '),
      score: data.score,
      attempts: data.attempts
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  
  // Calculate daily activity for chart
  const calculateDailyActivity = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDay = new Date().getDay(); // 0-6 (Sunday-Saturday)
    
    // Rotate array to make current day the last entry
    const orderedDays = [...days.slice(currentDay + 1), ...days.slice(0, currentDay + 1)];
    
    // Get weekly activity data from stats
    const activityData = stats?.weeklyActivity || Array(7).fill(0);
    
    // Rotate data to match day order
    const orderedActivity = [...activityData.slice(currentDay + 1), ...activityData.slice(0, currentDay + 1)];
    
    return {
      labels: orderedDays,
      data: orderedActivity
    };
  };
  
  const dailyActivity = calculateDailyActivity();
  
  // Get recent search terms
  const recentSearchTerms = filterByTimeRange(searchHistory)
    .slice(0, 5)
    .map(item => item.query);
  
  return (
    <div className="min-h-[calc(100vh-200px)]">
      {/* Header Section */}
      <section className={`py-10 ${darkMode ? 'bg-gray-800/50' : 'bg-indigo-50/50'} rounded-xl`}>
        <div className="max-w-4xl mx-auto px-6">
          <h1 className={`text-3xl md:text-4xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Your Learning Progress
          </h1>
          <p className={`text-center mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Track your improvement and see how far you've come
          </p>
          
          {/* Time range selector */}
          <div className="flex justify-center mb-6">
            <div className={`inline-flex rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} p-1 shadow`}>
              {[
                { value: 'week', label: 'This Week' },
                { value: 'month', label: 'This Month' },
                { value: 'all', label: 'All Time' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setTimeRange(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    timeRange === option.value
                      ? 'bg-indigo-600 text-white'
                      : `${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading your progress data...
          </p>
        </div>
      )}
      
      {/* Main Content */}
      {!loading && stats && (
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Questions */}
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Questions</p>
                    <h3 className={`text-3xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {stats.totalQuestions || 0}
                    </h3>
                  </div>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-indigo-100'}`}>
                    <DocumentTextIcon className="h-6 w-6 text-indigo-500" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span className="text-green-500 font-medium">
                      {Math.round((stats.correctAnswers / Math.max(stats.totalQuestions, 1)) * 100)}%
                    </span>
                    {' '}accuracy rate
                  </p>
                </div>
              </div>
              
              {/* Concepts Explored */}
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Concepts Explored</p>
                    <h3 className={`text-3xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {Object.keys(conceptMastery).length || 0}
                    </h3>
                  </div>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-100'}`}>
                    <BookOpenIcon className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span className="text-blue-500 font-medium">
                      {topConcepts.length > 0 ? Math.round(topConcepts[0].score * 100) : 0}%
                    </span>
                    {' '}mastery of top concept
                  </p>
                </div>
              </div>
              
              {/* Current Streak */}
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Current Streak</p>
                    <h3 className={`text-3xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {stats.streakDays || 0} days
                    </h3>
                  </div>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-orange-100'}`}>
                    <FireIcon className="h-6 w-6 text-orange-500" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Last active: {stats.lastActiveDate ? new Date(stats.lastActiveDate).toLocaleDateString() : 'Never'}
                  </p>
                </div>
              </div>
              
              {/* Study Time */}
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Study Time</p>
                    <h3 className={`text-3xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {stats.timeSpent || 0} min
                    </h3>
                  </div>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-purple-100'}`}>
                    <ClockIcon className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span className="text-purple-500 font-medium">
                      {Math.round((stats.timeSpent || 0) / 60)}h
                    </span>
                    {' '}total learning time
                  </p>
                </div>
              </div>
            </div>
            
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Weekly Activity Chart */}
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Weekly Activity
                  </h3>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                    Last 7 days
                  </div>
                </div>
                <div className="h-64 relative">
                  {/* Bar Chart */}
                  <div className="absolute bottom-0 left-0 right-0 flex items-end justify-around h-52">
                    {dailyActivity.data.map((value, index) => (
                      <div key={index} className="flex flex-col items-center justify-end w-1/8 px-2">
                        <div
                          style={{ height: `${Math.min(100, (value / Math.max(...dailyActivity.data, 1)) * 100)}%` }}
                          className={`w-full rounded-t-md ${index === 6 ? 'bg-indigo-500' : darkMode ? 'bg-indigo-700' : 'bg-indigo-200'}`}
                        ></div>
                        <span className={`mt-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {dailyActivity.labels[index]}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Y-axis labels */}
                  <div className="absolute top-0 left-0 bottom-0 flex flex-col justify-between text-xs text-right pr-2">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {Math.max(...dailyActivity.data, 10)} min
                    </span>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {Math.max(...dailyActivity.data, 10) / 2} min
                    </span>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>0 min</span>
                  </div>
                </div>
              </div>
              
              {/* Concept Mastery Chart */}
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Concept Mastery
                  </h3>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                    Top concepts
                  </div>
                </div>
                
                {topConcepts.length > 0 ? (
                  <div className="space-y-4">
                    {topConcepts.map((concept, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className={`text-sm font-medium capitalize ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {concept.name}
                          </span>
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {Math.round(concept.score * 100)}%
                          </span>
                        </div>
                        <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                          <div
                            style={{ width: `${concept.score * 100}%` }}
                            className={`h-full rounded-full ${
                              concept.score > 0.8
                                ? 'bg-green-500' 
                                : concept.score > 0.5 
                                  ? 'bg-yellow-500' 
                                  : 'bg-red-500'
                            }`}
                          ></div>
                        </div>
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {concept.attempts} practice attempts
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48">
                    <AcademicCapIcon className={`h-12 w-12 ${darkMode ? 'text-gray-600' : 'text-gray-300'} mb-4`} />
                    <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      No concept mastery data yet.
                      <br />
                      Practice more to see your progress!
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Additional Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Recent Practice Results */}
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Recent Practice Results
                </h3>
                
                {filteredPracticeResults.length > 0 ? (
                  <div className={`overflow-hidden rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                        <tr>
                          <th className={`px-4 py-3.5 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                            Topic
                          </th>
                          <th className={`px-4 py-3.5 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                            Result
                          </th>
                          <th className={`px-4 py-3.5 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} uppercase tracking-wider`}>
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                        {filteredPracticeResults.slice(0, 5).map((result, index) => (
                          <tr key={index}>
                            <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'} capitalize`}>
                              {result.topic || result.conceptId?.split('-').slice(1).join(' ') || 'Unknown'}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {result.correct ? (
                                <span className="flex items-center text-green-500">
                                  <CheckIcon className="h-4 w-4 mr-1" />
                                  Correct
                                </span>
                              ) : (
                                <span className="flex items-center text-red-500">
                                  <XMarkIcon className="h-4 w-4 mr-1" />
                                  Incorrect
                                </span>
                              )}
                            </td>
                            <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {new Date(result.timestamp).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10">
                    <TrophyIcon className={`h-12 w-12 ${darkMode ? 'text-gray-600' : 'text-gray-300'} mb-4`} />
                    <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      No practice results in the selected time period.
                    </p>
                  </div>
                )}
              </div>
              
              {/* Learning Activity */}
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6`}>
                <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Learning Activity
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Recent Search Topics
                    </h4>
                    
                    {recentSearchTerms.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {recentSearchTerms.map((term, index) => (
                          <span
                            key={index}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              darkMode 
                                ? 'bg-indigo-900/30 text-indigo-300' 
                                : 'bg-indigo-100 text-indigo-700'
                            }`}
                          >
                            {term}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        No recent searches
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Practice Accuracy
                        </span>
                        <span className={`text-lg font-bold ${
                          practiceAccuracy > 70 
                            ? 'text-green-500' 
                            : practiceAccuracy > 40 
                              ? 'text-yellow-500' 
                              : 'text-red-500'
                        }`}>
                          {practiceAccuracy}%
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                          <div
                            style={{ width: `${practiceAccuracy}%` }}
                            className={`h-full rounded-full ${
                              practiceAccuracy > 70 
                                ? 'bg-green-500' 
                                : practiceAccuracy > 40 
                                  ? 'bg-yellow-500' 
                                  : 'bg-red-500'
                            }`}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Daily Goal
                        </span>
                        <span className={`text-lg font-bold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                          {Math.min(100, Math.round((stats.timeSpent || 0) / 10) * 10)}%
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                          <div
                            style={{ width: `${Math.min(100, Math.round((stats.timeSpent || 0) / 10) * 10)}%` }}
                            className="h-full rounded-full bg-indigo-500"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Average Study Time
                    </h4>
                    
                    <div className="flex items-center">
                      <ClockIcon className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`} />
                      <span className={`${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                        {stats.weeklyActivity && stats.weeklyActivity.reduce((a, b) => a + b, 0) > 0
                          ? Math.round(stats.weeklyActivity.reduce((a, b) => a + b, 0) / stats.weeklyActivity.filter(d => d > 0).length)
                          : 0
                        } minutes per active day
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Empty State */}
      {!loading && (!stats || (!stats.totalQuestions && !stats.timeSpent)) && (
        <section className="py-12">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <div className={`mb-8 p-3 rounded-full inline-block ${darkMode ? 'bg-indigo-900/30' : 'bg-indigo-100'}`}>
              <ChartBarIcon className="h-12 w-12 text-indigo-500" />
            </div>
            
            <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              No Progress Data Yet
            </h2>
            
            <p className={`mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Start practicing and reviewing concepts to see your progress here.
              Your learning journey will be visualized with charts and insights.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/search"
                className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
              >
                Start Learning
              </Link>
              <Link
                to="/practice"
                className={`px-6 py-3 rounded-lg font-medium ${darkMode 
                  ? 'bg-gray-800 text-white hover:bg-gray-700' 
                  : 'bg-white text-indigo-600 hover:bg-gray-50'} border border-gray-300 shadow-md hover:shadow-lg transition-colors`}
              >
                <AcademicCapIcon className="h-5 w-5 inline-block mr-2" />
                Try Practice Problems
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default Progress;