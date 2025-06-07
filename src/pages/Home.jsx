import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SparklesIcon, LightBulbIcon, AcademicCapIcon, ClockIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';

function Home() {
  const { darkMode } = useTheme();

  // Track page view
  useEffect(() => {
    // In a production app, we would track analytics here
    document.title = 'Mastery.ai - Learning Made Simple';
  }, []);

  // Feature cards data
  const features = [
    {
      title: 'Instant Explanations',
      description: 'Get immediate answers and explanations to any academic question, tailored to your learning level.',
      icon: <LightBulbIcon className="h-8 w-8 text-indigo-500" />,
      link: '/search'
    },
    {
      title: 'Practice Problems',
      description: 'Strengthen your understanding with adaptive practice problems that match your skill level.',
      icon: <AcademicCapIcon className="h-8 w-8 text-indigo-600" />,
      link: '/practice'
    },
    {
      title: 'Spaced Repetition',
      description: 'Never forget what you learn with our scientifically-proven review scheduling system.',
      icon: <ClockIcon className="h-8 w-8 text-indigo-700" />,
      link: '/review'
    },
    {
      title: 'Visual Progress',
      description: 'Track your learning journey with intuitive charts and see your knowledge grow over time.',
      icon: <ChartBarIcon className="h-8 w-8 text-indigo-800" />,
      link: '/progress'
    }
  ];

  return (
    <div className="min-h-[calc(100vh-200px)]">
      {/* Hero Section */}
      <section className={`py-12 px-4 sm:px-6 md:py-20 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-50 to-white'} rounded-xl`}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
            Learning Made <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Simple</span>
          </h1>
          
          <p className={`max-w-2xl mx-auto text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-10`}>
            Get instant explanations, practice with adaptive problems, and never forget what you've learned with Mastery.ai's personalized learning tools.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/search"
              className="px-8 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
            >
              Ask a Question
            </Link>
            <Link
              to="/practice"
              className={`px-8 py-3 rounded-lg font-medium ${darkMode 
                ? 'bg-gray-800 text-white hover:bg-gray-700' 
                : 'bg-white text-indigo-600 hover:bg-gray-50'} border border-gray-300 shadow-md hover:shadow-lg transition-colors`}
            >
              Practice Now
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-16 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Everything You Need to Excel
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'} shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`p-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-indigo-100'} mb-5`}>
                    {feature.icon}
                  </div>
                  <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {feature.title}
                  </h3>
                  <p className={`mb-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {feature.description}
                  </p>
                  <Link
                    to={feature.link}
                    className="text-indigo-500 hover:text-indigo-600 font-medium flex items-center"
                  >
                    Try it now
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl my-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-16 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            How Mastery.ai Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-indigo-100'} flex items-center justify-center mb-5`}>
                <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-indigo-600'}`}>1</span>
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Ask Any Question
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Start by typing any academic question you're struggling with. Our AI will understand what you're asking, no matter the subject.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-indigo-100'} flex items-center justify-center mb-5`}>
                <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-indigo-600'}`}>2</span>
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Get Personalized Learning
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Receive tailored explanations, practice problems, and supporting resources that match your academic level and learning style.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-indigo-100'} flex items-center justify-center mb-5`}>
                <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-indigo-600'}`}>3</span>
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Build Lasting Knowledge
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Review concepts at optimal intervals with our spaced repetition system, ensuring you retain what you learn for the long term.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Ready to transform your learning experience?
          </h2>
          <p className={`mb-8 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Join thousands of students who are already learning more effectively with Mastery.ai.
          </p>
          <Link
            to="/search"
            className="px-8 py-4 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
          >
            Start Learning Now
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;