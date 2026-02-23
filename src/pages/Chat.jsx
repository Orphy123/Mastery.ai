import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { sendMessage } from '../services/openai';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { SparklesIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: "Hi! I'm your **Mastery.ai** study assistant. Ask me anything — I can explain concepts, help with homework, quiz you on a topic, or just chat about what you're learning. What's on your mind?",
  timestamp: new Date().toISOString(),
};

function Chat() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { user } = useAuth();
  const { darkMode } = useTheme();

  useEffect(() => {
    document.title = 'Chat - Mastery.ai';
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim(), timestamp: new Date().toISOString() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const apiHistory = updatedMessages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-12)
        .map(({ role, content }) => ({ role, content }));

      const response = await sendMessage(apiHistory);

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response, timestamp: new Date().toISOString() },
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: error.message?.includes('API key')
            ? 'The OpenAI API key is not configured. Please add `VITE_OPENAI_API_KEY` to your `.env` file.'
            : 'Sorry, something went wrong. Please try again.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const quickPrompts = [
    'Explain quantum physics simply',
    'Quiz me on world history',
    'Help me study for a math test',
    'What causes climate change?',
  ];

  const isEmpty = messages.length <= 1;

  return (
    <div className="max-w-4xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 160px)' }}>
      {/* Header */}
      <div className={`flex items-center gap-3 px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className={`p-2 rounded-xl ${darkMode ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
          <SparklesIcon className="h-5 w-5 text-indigo-500" />
        </div>
        <div>
          <h1 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>AI Study Assistant</h1>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Powered by GPT-4o mini</p>
        </div>
      </div>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto px-4 py-6 space-y-5 ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50/50'}`}>
        {messages.map((message, index) => (
          <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              message.role === 'user'
                ? 'bg-indigo-600 text-white'
                : darkMode ? 'bg-gray-700' : 'bg-white ring-1 ring-gray-200'
            }`}>
              {message.role === 'user' ? (
                <span className="text-xs font-bold">{(user?.full_name || user?.email || 'U')[0].toUpperCase()}</span>
              ) : (
                <SparklesIcon className="h-4 w-4 text-indigo-500" />
              )}
            </div>

            {/* Bubble */}
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
              message.role === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-md'
                : darkMode
                  ? 'bg-gray-800 text-gray-100 ring-1 ring-gray-700 rounded-tl-md'
                  : 'bg-white text-gray-800 ring-1 ring-gray-200 shadow-sm rounded-tl-md'
            }`}>
              {message.role === 'assistant' ? (
                <div className={`prose prose-sm max-w-none ${darkMode ? 'prose-invert' : ''} prose-p:my-1.5 prose-li:my-0.5 prose-ul:my-1.5 prose-headings:mb-2 prose-headings:mt-3`}>
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm leading-relaxed">{message.content}</p>
              )}
              <p className={`text-[10px] mt-1.5 ${
                message.role === 'user' ? 'text-indigo-200' : darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex gap-3">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-white ring-1 ring-gray-200'}`}>
              <SparklesIcon className="h-4 w-4 text-indigo-500" />
            </div>
            <div className={`rounded-2xl rounded-tl-md px-4 py-3 ${darkMode ? 'bg-gray-800 ring-1 ring-gray-700' : 'bg-white ring-1 ring-gray-200'}`}>
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts for empty state */}
      {isEmpty && (
        <div className="px-4 pb-3">
          <div className="flex flex-wrap gap-2 justify-center">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => { setInput(prompt); setTimeout(() => inputRef.current?.form?.requestSubmit(), 50); }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 ring-1 ring-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100 ring-1 ring-gray-200'
                }`}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className={`px-4 py-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className={`flex items-center gap-3 rounded-xl px-4 py-2 ring-1 transition-all focus-within:ring-2 focus-within:ring-indigo-500 ${
          darkMode ? 'bg-gray-800 ring-gray-700' : 'bg-white ring-gray-200'
        }`}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className={`flex-1 bg-transparent text-sm focus:outline-none ${
              darkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
            }`}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <PaperAirplaneIcon className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default Chat;
