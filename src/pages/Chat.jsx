import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const { darkMode } = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // TODO: Implement chat API call
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          userId: user.id,
        }),
      });

      const data = await response.json();

      const assistantMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className={`rounded-lg shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Chat with AI Assistant
          </h1>
        </div>

        <div
          className={`h-[calc(100vh-300px)] overflow-y-auto p-4 space-y-4 ${
            darkMode ? 'bg-gray-900' : 'bg-gray-50'
          }`}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? darkMode
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-600 text-white'
                    : darkMode
                    ? 'bg-gray-700 text-white'
                    : 'bg-white text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.role === 'user'
                      ? darkMode
                        ? 'text-indigo-200'
                        : 'text-indigo-200'
                      : darkMode
                      ? 'text-gray-400'
                      : 'text-gray-500'
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
                }`}
              >
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className={`flex-1 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                darkMode
                  ? 'bg-gray-700 text-white placeholder-gray-400'
                  : 'bg-white text-gray-900 placeholder-gray-500'
              }`}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`p-2 rounded-lg ${
                isLoading || !input.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } text-white`}
            >
              <PaperAirplaneIcon className="h-6 w-6" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chat; 