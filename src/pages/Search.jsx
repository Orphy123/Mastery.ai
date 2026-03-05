import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  LightBulbIcon,
  PlayCircleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';

/* ──────────────────────────────────────────────
   Section styling config
   ────────────────────────────────────────────── */
const SECTION_STYLES = [
  { match: 'nutshell',     emoji: '🎯', label: 'In a Nutshell',       bg: 'bg-indigo-50  dark:bg-indigo-500/10', border: 'border-indigo-400', ring: 'ring-indigo-200 dark:ring-indigo-500/20' },
  { match: 'key ideas',    emoji: '💡', label: 'Key Ideas',           bg: 'bg-amber-50   dark:bg-amber-500/10',  border: 'border-amber-400',  ring: 'ring-amber-200 dark:ring-amber-500/20'  },
  { match: 'how it works', emoji: '⚙️', label: 'How It Works',        bg: 'bg-emerald-50 dark:bg-emerald-500/10',border: 'border-emerald-400',ring: 'ring-emerald-200 dark:ring-emerald-500/20' },
  { match: 'real-world',   emoji: '🌍', label: 'Real-World Examples',  bg: 'bg-purple-50  dark:bg-purple-500/10', border: 'border-purple-400', ring: 'ring-purple-200 dark:ring-purple-500/20' },
  { match: 'fun fact',     emoji: '🤩', label: 'Fun Fact',            bg: 'bg-pink-50    dark:bg-pink-500/10',   border: 'border-pink-400',   ring: 'ring-pink-200 dark:ring-pink-500/20'    },
  { match: 'think about',  emoji: '🧠', label: 'Think About It',      bg: 'bg-rose-50    dark:bg-rose-500/10',   border: 'border-rose-400',   ring: 'ring-rose-200 dark:ring-rose-500/20'    },
  { match: 'deep dive',    emoji: '🔬', label: 'Deep Dive',           bg: 'bg-cyan-50    dark:bg-cyan-500/10',   border: 'border-cyan-400',   ring: 'ring-cyan-200 dark:ring-cyan-500/20'    },
  { match: 'go further',   emoji: '📚', label: 'Go Further',          bg: 'bg-teal-50    dark:bg-teal-500/10',   border: 'border-teal-400',   ring: 'ring-teal-200 dark:ring-teal-500/20'    },
];

const DEFAULT_STYLE = { emoji: '📝', bg: 'bg-gray-50 dark:bg-gray-500/10', border: 'border-gray-400', ring: 'ring-gray-200 dark:ring-gray-500/20' };

function getStyleForTitle(title) {
  const lower = title.toLowerCase();
  return SECTION_STYLES.find((s) => lower.includes(s.match)) || { ...DEFAULT_STYLE, label: title };
}

/* ──────────────────────────────────────────────
   Parse structured markdown into sections
   ────────────────────────────────────────────── */
function parseExplanation(markdown) {
  const lines = markdown.split('\n');
  const sections = [];
  let intro = [];
  let current = null;

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (current) sections.push(current);
      current = { title: line.slice(3).trim(), content: '' };
    } else if (current) {
      current.content += line + '\n';
    } else {
      intro.push(line);
    }
  }
  if (current) sections.push(current);

  return {
    intro: intro.join('\n').trim(),
    sections: sections.map((s) => ({ ...s, content: s.content.trim() })),
  };
}

/* ──────────────────────────────────────────────
   Component: SectionCard
   ────────────────────────────────────────────── */
function SectionCard({ title, content, index, darkMode }) {
  const style = getStyleForTitle(title);

  return (
    <div
      className={`group relative rounded-2xl border-l-[4px] ${style.border} ring-1 ${style.ring} overflow-hidden transition-shadow hover:shadow-md ${
        darkMode ? 'bg-gray-800/70' : 'bg-white'
      }`}
    >
      <div className={`px-5 pt-4 pb-3 ${style.bg}`}>
        <div className="flex items-center gap-2.5">
          <span className="text-xl leading-none" role="img" aria-label={style.label}>
            {style.emoji}
          </span>
          <h3 className={`text-sm font-bold uppercase tracking-wide ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            {title}
          </h3>
        </div>
      </div>
      <div className="px-5 pb-5 pt-3">
        <div className={`prose prose-sm max-w-none leading-relaxed ${
          darkMode ? 'prose-invert' : ''
        } prose-p:my-2 prose-li:my-0.5 prose-ul:my-2 prose-ol:my-2 prose-strong:font-semibold
          prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline`}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Component: GradePills (used in both hero & results)
   ────────────────────────────────────────────── */
const GRADE_LABELS = { elementary: 'Elementary', middle: 'Middle School', high: 'High School', college: 'College' };

function GradePills({ selected, onChange, darkMode, loading, size = 'sm' }) {
  const base = size === 'sm' ? 'px-3.5 py-1.5 text-xs' : 'px-4 py-2 text-sm';
  return (
    <div className="flex flex-wrap items-center gap-2">
      {Object.entries(GRADE_LABELS).map(([key, label]) => {
        const isActive = selected === key;
        const isLoading = loading === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            disabled={isLoading}
            className={`relative ${base} rounded-full font-medium transition-all ${
              isActive
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : darkMode
                  ? 'bg-gray-700/60 text-gray-300 hover:bg-gray-600'
                  : 'bg-white text-gray-600 hover:bg-gray-100 ring-1 ring-gray-200'
            } ${isLoading ? 'cursor-wait' : ''}`}
          >
            <span className={isLoading ? 'opacity-0' : ''}>{label}</span>
            {isLoading && (
              <span className="absolute inset-0 flex items-center justify-center">
                <ArrowPathIcon className="h-3.5 w-3.5 animate-spin text-current" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Main Search component
   ────────────────────────────────────────────── */
function Search() {
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [explanation, setExplanation] = useState('');
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [levelLoading, setLevelLoading] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState('middle');
  const [recentQueries, setRecentQueries] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const searchInputRef = useRef(null);
  const resultRef = useRef(null);
  const explanationCache = useRef({});
  const navigate = useNavigate();

  const { currentUser } = useAuth();
  const { darkMode } = useTheme();

  useEffect(() => { document.title = 'Mastery.AI'; }, []);
  useEffect(() => { setRecentQueries(getSearchHistory(5)); }, []);
  useEffect(() => {
    if (videos.length > 0 && !activeVideo) setActiveVideo(videos[0]);
  }, [videos]);

  const cacheKey = (q, g) => `${q.trim().toLowerCase()}::${g}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setShowHistory(false);
    searchInputRef.current?.blur();

    const grade = selectedGrade;
    const trimmed = query.trim();
    setIsLoading(true);
    setIsStreaming(false);
    setExplanation('');
    setVideos([]);
    setActiveVideo(null);
    setActiveQuery(trimmed);

    try {
      const searchItem = { query: trimmed, timestamp: new Date().toISOString(), gradeLevel: grade };
      addToSearchHistory(searchItem);
      setRecentQueries([searchItem, ...recentQueries.filter((i) => i.query !== trimmed).slice(0, 4)]);

      const key = cacheKey(trimmed, grade);

      const videoPromise = searchVideos(trimmed, { maxResults: 4 }).then((vids) => {
        setVideos(vids);
      }).catch((err) => console.error('Video fetch error:', err));

      if (explanationCache.current[key]) {
        setExplanation(explanationCache.current[key]);
      } else {
        let scrolled = false;
        setIsStreaming(true);
        const finalText = await generateExplanation(trimmed, grade, {
          onUpdate: (text) => {
            setExplanation(text);
            if (!scrolled) {
              scrolled = true;
              setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
            }
          },
        });
        explanationCache.current[key] = finalText;
        setIsStreaming(false);
      }

      await videoPromise;
    } catch (error) {
      console.error('Search error:', error);
      setExplanation('Sorry, we encountered an error processing your question. Please try again.');
      setIsStreaming(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGradeSwitch = useCallback(async (newGrade) => {
    if (newGrade === selectedGrade) return;

    setSelectedGrade(newGrade);

    if (!activeQuery) return;

    const key = cacheKey(activeQuery, newGrade);

    if (explanationCache.current[key]) {
      setExplanation(explanationCache.current[key]);
      return;
    }

    setLevelLoading(newGrade);
    setExplanation('');
    setIsStreaming(true);
    try {
      const finalText = await generateExplanation(activeQuery, newGrade, {
        onUpdate: (text) => setExplanation(text),
      });
      explanationCache.current[key] = finalText;
      setIsStreaming(false);
    } catch (error) {
      console.error('Grade switch error:', error);
      setIsStreaming(false);
    } finally {
      setLevelLoading(null);
    }
  }, [selectedGrade, activeQuery]);

  const selectQuery = (historicalQuery) => {
    setQuery(historicalQuery.query);
    setSelectedGrade(historicalQuery.gradeLevel || 'middle');
    setShowHistory(false);
    setTimeout(() => {
      searchInputRef.current?.form?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 100);
  };

  const handlePractice = () => {
    if (!activeQuery) return;
    navigate('/practice', { state: { topic: activeQuery, difficulty: selectedGrade } });
  };

  const hasResults = !!explanation || isStreaming;
  const parsed = explanation ? parseExplanation(explanation) : null;

  return (
    <div className="min-h-[calc(100vh-200px)]">
      {/* ───── Search Hero ───── */}
      <section className={`relative py-12 rounded-2xl overflow-hidden ${
        darkMode
          ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-indigo-900/40'
          : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'
      }`}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl ${darkMode ? 'bg-indigo-500/10' : 'bg-indigo-200/40'}`} />
          <div className={`absolute -bottom-24 -left-24 w-72 h-72 rounded-full blur-3xl ${darkMode ? 'bg-purple-500/10' : 'bg-purple-200/30'}`} />
        </div>

        <div className="relative max-w-3xl mx-auto px-6">
          <h1 className={`text-3xl md:text-4xl font-extrabold mb-3 text-center leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            What do you want to learn?
          </h1>
          <p className={`text-center mb-8 text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Ask any question and get an instant, tailored explanation with videos
          </p>

          <form onSubmit={handleSubmit} className="relative">
            <div className={`relative flex items-center rounded-xl shadow-lg ring-1 transition-all focus-within:ring-2 focus-within:ring-indigo-500 ${
              darkMode ? 'bg-gray-700/80 ring-gray-600 backdrop-blur' : 'bg-white ring-gray-200 backdrop-blur'
            }`}>
              <MagnifyingGlassIcon className="h-5 w-5 ml-4 flex-shrink-0 text-gray-400" />
              <input
                type="text"
                ref={searchInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowHistory(true)}
                onBlur={() => setTimeout(() => setShowHistory(false), 200)}
                placeholder="e.g., How does photosynthesis work?"
                className={`w-full py-4 px-3 bg-transparent text-base focus:outline-none ${
                  darkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                }`}
                disabled={isLoading || isStreaming}
              />
              {query.length > 0 && (
                <button type="button" className={`p-1.5 mr-1 rounded-md ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`} onClick={() => setQuery('')} aria-label="Clear search">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <button type="submit" disabled={isLoading || isStreaming || !query.trim()} className="flex items-center gap-1.5 mr-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0">
                {(isLoading || isStreaming) ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : <>Search</>}
              </button>

              {showHistory && recentQueries.length > 0 && (
                <div className={`absolute z-20 top-full left-0 right-0 mt-2 rounded-xl shadow-xl border overflow-hidden ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <div className={`px-4 py-2.5 ${darkMode ? '' : 'bg-gray-50'}`}>
                    <p className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Recent</p>
                  </div>
                  {recentQueries.map((item, idx) => (
                    <button key={idx} type="button" className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                      darkMode ? 'hover:bg-gray-700/60' : 'hover:bg-indigo-50/60'
                    } ${idx !== recentQueries.length - 1 ? `border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}` : ''}`} onMouseDown={() => selectQuery(item)}>
                      <div className="flex items-center gap-2.5">
                        <ClockIcon className={`h-4 w-4 flex-shrink-0 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{item.query}</span>
                      </div>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>{item.gradeLevel}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Grade pills in hero — only visible when no results */}
            {!hasResults && (
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                <span className={`text-xs font-medium mr-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Level:</span>
                <GradePills selected={selectedGrade} onChange={setSelectedGrade} darkMode={darkMode} />
              </div>
            )}
          </form>
        </div>
      </section>

      {/* ───── Results ───── */}
      <section className="py-8" ref={resultRef}>
        <div className="max-w-5xl mx-auto px-4">
          {isLoading && !explanation ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-indigo-100 dark:border-indigo-900" />
                <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-t-indigo-500 animate-spin" />
              </div>
              <p className={`mt-6 text-base font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Crafting your explanation...</p>
              <p className={`mt-1 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>This usually takes a few seconds</p>
            </div>
          ) : parsed ? (
            <div className="space-y-8">
              {/* ── Result Header with dynamic grade toggle ── */}
              <div className={`flex flex-col gap-4 pb-5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 p-2 rounded-lg ${darkMode ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                      <LightBulbIcon className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div>
                      <h2 className={`text-lg font-bold leading-snug ${darkMode ? 'text-white' : 'text-gray-900'}`}>{activeQuery}</h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={handlePractice} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm">
                      <AcademicCapIcon className="h-4 w-4" />Practice
                    </button>
                  </div>
                </div>

                {/* Dynamic grade switcher */}
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Explain for:</span>
                  <GradePills
                    selected={selectedGrade}
                    onChange={handleGradeSwitch}
                    darkMode={darkMode}
                    loading={levelLoading}
                    size="sm"
                  />
                </div>
              </div>

              {/* ── Content area with loading overlay ── */}
              <div className={`relative transition-opacity duration-200 ${levelLoading && !explanation ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                {/* TLDR Banner */}
                {parsed.intro && (
                  <div className={`relative rounded-2xl overflow-hidden mb-8 ${
                    darkMode
                      ? 'bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-indigo-600/20 ring-1 ring-indigo-500/30'
                      : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500'
                  }`}>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvc3ZnPg==')] opacity-50" />
                    <div className="relative px-6 py-5 flex items-start gap-3">
                      <span className="text-2xl mt-0.5">⚡</span>
                      <div className={`text-base font-medium leading-relaxed ${darkMode ? 'text-gray-100' : 'text-white'}`}>
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p>{children}</p>,
                            strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                          }}
                        >
                          {parsed.intro}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}

                {/* Section Cards */}
                {parsed.sections.length > 0 && (
                  <div className="grid gap-5 md:grid-cols-2">
                    {parsed.sections.map((section, idx) => {
                      const isFullWidth = idx === 0 || idx === parsed.sections.length - 1;
                      return (
                        <div key={`${selectedGrade}-${idx}`} className={`animate-card-in ${isFullWidth ? 'md:col-span-2' : ''}`} style={{ animationDelay: `${idx * 80}ms` }}>
                          <SectionCard title={section.title} content={section.content} index={idx} darkMode={darkMode} />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Streaming indicator */}
                {isStreaming && (
                  <div className="flex items-center gap-2 py-2">
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Writing...</span>
                  </div>
                )}

                {/* Fallback */}
                {parsed.sections.length === 0 && parsed.intro && (
                  <div className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-800/80 ring-1 ring-gray-700' : 'bg-white ring-1 ring-gray-200 shadow-sm'}`}>
                    <div className="px-6 sm:px-8 py-6 sm:py-8">
                      <div className={`prose prose-base max-w-none ${darkMode ? 'prose-invert' : ''}`}>
                        <ReactMarkdown>{explanation}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Videos Section ── */}
              {videos.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <PlayCircleIcon className={`h-5 w-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Watch & Learn</h3>
                  </div>

                  <div className="grid lg:grid-cols-5 gap-5">
                    <div className="lg:col-span-3">
                      <div className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-800 ring-1 ring-gray-700' : 'bg-white ring-1 ring-gray-200 shadow-sm'}`}>
                        <div className="aspect-video">
                          <iframe
                            src={getEmbedUrl(activeVideo?.videoId || videos[0].videoId)}
                            title={activeVideo?.title || videos[0].title}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                        <div className="p-4">
                          <h4 className={`font-semibold text-sm leading-snug line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {activeVideo?.title || videos[0].title}
                          </h4>
                          <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {activeVideo?.channelName || videos[0].channelName} &middot; {activeVideo?.viewCount || videos[0].viewCount} views
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-2 flex flex-col gap-3">
                      {videos.map((video, idx) => (
                        <button key={idx} onClick={() => setActiveVideo(video)} className={`group flex gap-3 p-2 rounded-xl text-left transition-all ${
                          activeVideo?.videoId === video.videoId
                            ? darkMode ? 'bg-indigo-500/15 ring-1 ring-indigo-500/40' : 'bg-indigo-50 ring-1 ring-indigo-200'
                            : darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                        }`}>
                          <div className="relative w-28 h-[4.25rem] flex-shrink-0 rounded-lg overflow-hidden">
                            <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                            <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                              activeVideo?.videoId === video.videoId ? 'bg-indigo-600/30 opacity-100' : 'bg-black/20 opacity-0 group-hover:opacity-100'
                            }`}>
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${activeVideo?.videoId === video.videoId ? 'bg-white/90' : 'bg-black/60'}`}>
                                <svg className={`w-3 h-3 ml-0.5 ${activeVideo?.videoId === video.videoId ? 'text-indigo-600' : 'text-white'}`} fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0 py-0.5">
                            <h5 className={`text-xs font-semibold leading-snug line-clamp-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{video.title}</h5>
                            <p className={`mt-1 text-[11px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{video.channelName}</p>
                            <p className={`text-[11px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{video.viewCount} views</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : activeQuery && (isStreaming || levelLoading) ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Generating explanation...</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className={`p-5 rounded-2xl mb-6 ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-indigo-50 to-purple-50'}`}>
                <MagnifyingGlassIcon className={`h-10 w-10 ${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
              </div>
              <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Ready to explore?</h2>
              <p className={`max-w-sm text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Type any academic question above to get an instant, personalized explanation with related videos.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Search;
