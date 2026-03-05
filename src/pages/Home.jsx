import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  SparklesIcon,
  LightBulbIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  {
    title: 'AI Explanations',
    description: 'Get instant, grade-level explanations with supporting YouTube videos for any topic.',
    icon: LightBulbIcon,
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    link: '/search',
  },
  {
    title: 'Practice Problems',
    description: 'Strengthen understanding with AI-generated questions that adapt to your skill level.',
    icon: AcademicCapIcon,
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    link: '/practice',
  },
  {
    title: 'Progress Tracking',
    description: 'Visualize your learning journey with detailed stats, streaks, and mastery charts.',
    icon: ChartBarIcon,
    color: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-50 dark:bg-purple-500/10',
    link: '/progress',
  },
  {
    title: 'AI Chat Tutor',
    description: 'Have a conversation with your personal AI study assistant — anytime, any subject.',
    icon: ChatBubbleLeftRightIcon,
    color: 'from-indigo-500 to-violet-500',
    bg: 'bg-indigo-50 dark:bg-indigo-500/10',
    link: '/chat',
  },
];

const STEPS = [
  { num: '01', title: 'Ask a Question', desc: 'Type any academic question — any subject, any level.' },
  { num: '02', title: 'Learn Instantly', desc: 'Get a tailored explanation, videos, and practice problems.' },
  { num: '03', title: 'Master It', desc: 'Practice with adaptive problems and track your progress over time.' },
];

function Home() {
  const { darkMode } = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'Mastery.AI';
  }, []);

  return (
    <div className="min-h-[calc(100vh-200px)] space-y-24 pb-12">
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className={`absolute inset-0 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'}`} />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-indigo-400/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-purple-400/10 blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center py-20 md:py-28 px-4">
          <h1 className={`text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Learning Made{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Simple
            </span>
          </h1>

          <p className={`max-w-2xl mx-auto text-lg md:text-xl leading-relaxed mb-10 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Get instant AI explanations, adaptive practice problems, and progress tracking to help you master any subject.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to={user ? '/search' : '/login'}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
            >
              {user ? 'Ask a Question' : 'Get Started Free'}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              to="/practice"
              className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold ring-1 transition-all hover:-translate-y-0.5 ${
                darkMode
                  ? 'bg-gray-800 text-white ring-gray-700 hover:bg-gray-750 hover:ring-gray-600'
                  : 'bg-white text-gray-700 ring-gray-200 hover:bg-gray-50 hover:ring-gray-300 shadow-sm'
              }`}
            >
              Try Practice
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Everything You Need to Excel
          </h2>
          <p className={`max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Five powerful tools designed to help you understand, practice, and retain any subject.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                to={feature.link}
                className={`group relative p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 ${
                  darkMode
                    ? 'bg-gray-800/50 hover:bg-gray-800 ring-1 ring-gray-800 hover:ring-gray-700'
                    : 'bg-white hover:bg-white ring-1 ring-gray-100 hover:ring-gray-200 shadow-sm hover:shadow-md'
                }`}
              >
                <div className={`inline-flex p-3 rounded-xl mb-4 ${feature.bg}`}>
                  <Icon className={`h-6 w-6 bg-gradient-to-br ${feature.color} bg-clip-text`} style={{ color: 'inherit' }} />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm leading-relaxed mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-indigo-500 group-hover:text-indigo-400 transition-colors">
                  Try it
                  <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className={`py-20 -mx-4 px-4 ${darkMode ? 'bg-gray-800/40' : 'bg-gray-50'}`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Three Steps to Mastery
            </h2>
            <p className={`max-w-xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              A simple process backed by science to help you learn faster and remember longer.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative text-center">
                <div className={`text-5xl font-black mb-4 ${darkMode ? 'text-gray-800' : 'text-gray-100'}`}>
                  {step.num}
                </div>
                <h3 className={`text-xl font-bold mb-3 -mt-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {step.title}
                </h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="max-w-3xl mx-auto text-center px-4">
        <div className={`rounded-3xl p-10 md:p-16 ${darkMode ? 'bg-gradient-to-br from-indigo-600/20 to-purple-600/20 ring-1 ring-indigo-500/20' : 'bg-gradient-to-br from-indigo-600 to-purple-600'}`}>
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-white'}`}>
            Ready to transform how you learn?
          </h2>
          <p className={`mb-8 text-lg ${darkMode ? 'text-indigo-200' : 'text-indigo-100'}`}>
            Join students who study smarter, not harder, with Mastery.ai.
          </p>
          <Link
            to={user ? '/search' : '/login'}
            className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold transition-all hover:-translate-y-0.5 ${
              darkMode
                ? 'bg-white text-indigo-700 hover:bg-gray-100'
                : 'bg-white text-indigo-700 hover:bg-indigo-50 shadow-lg shadow-indigo-900/20'
            }`}
          >
            Start Learning Now
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
