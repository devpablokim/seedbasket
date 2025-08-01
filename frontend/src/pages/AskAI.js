import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

const AskAI = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  const sampleQuestions = t('seebaAI.sampleQuestions', { returnObjects: true }) || [
    "What's the market outlook for SPY and QQQ today?",
    "How are gold (GLD) and silver (SLV) performing?",
    "Which sector ETFs are leading today's market?",
    "Analyze the correlation between oil prices and energy ETFs",
    "What's driving today's commodity movements?"
  ];

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      const response = await api.get('/ai/conversations');
      console.log('Fetched conversations:', response.data);
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  };

  const loadConversation = async (conversationId) => {
    try {
      const response = await api.get(`/ai/conversations/${conversationId}`);
      setMessages(response.data);
      setCurrentConversationId(conversationId);
    } catch (error) {
      console.error('Failed to load conversation:', error);
    }
  };

  const sendMessage = async (message = inputMessage) => {
    if (!message.trim() || loading) return;

    const userMessage = {
      role: 'user',
      message: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await api.post('/ai/chat', {
        message: message,
        conversationId: currentConversationId,
        language: i18n.language
      });

      setMessages(prev => [...prev, response.data.assistantMessage]);
      setCurrentConversationId(response.data.conversationId);
      // 약간의 지연 후 대화 목록 새로고침
      setTimeout(() => {
        fetchConversations();
      }, 500);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = error.response?.data?.error || 'Sorry, I encountered an error. Please try again.';
      setMessages(prev => [...prev, {
        role: 'assistant',
        message: errorMessage,
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setCurrentConversationId(null);
  };

  const deleteConversation = async (conversationId) => {
    try {
      await api.delete(`/ai/conversations/${conversationId}`);
      fetchConversations();
      if (conversationId === currentConversationId) {
        startNewConversation();
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-6 h-[calc(100vh-200px)]">
        {/* Sidebar with conversations */}
        <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200 p-4 overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">{t('seebaAI.conversations')}</h3>
            <button
              onClick={startNewConversation}
              className="text-sm bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700"
            >
              {t('seebaAI.newChat')}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2">
            {conversations.length === 0 ? (
              <div className="text-center text-gray-500 text-sm py-4">
                {t('seebaAI.noConversations')}
              </div>
            ) : (
              conversations.map(conv => (
                <div
                  key={conv.id}
                  className={`p-3 rounded cursor-pointer hover:bg-gray-50 ${
                    currentConversationId === conv.id ? 'bg-primary-50 border border-primary-200' : 'bg-gray-50'
                  }`}
                  onClick={() => loadConversation(conv.id)}
                >
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {conv.preview}
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <div className="text-xs text-gray-500">
                      {conv.timestamp && !isNaN(new Date(conv.timestamp)) 
                        ? format(new Date(conv.timestamp), 'MMM d, h:mm a')
                        : 'No date'}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conv.id);
                      }}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      {t('common.delete')}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main chat area */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{t('seebaAI.title')}</h2>
                <p className="text-sm text-gray-600">{t('seebaAI.subtitle')}</p>
              </div>
            </div>
            <div className="mt-3 p-3 bg-primary-50 rounded-md">
              <p className="text-sm text-primary-800">
                {t('seebaAI.description')}
              </p>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-3xl">S</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t('seebaAI.welcome')}
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {t('seebaAI.intro')}
                  </p>
                </div>
                <div className="space-y-2 max-w-2xl mx-auto">
                  <p className="text-sm text-gray-500 mb-3">{t('seebaAI.tryAsking')}</p>
                  {sampleQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(question)}
                      className="block w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-primary-50 hover:from-gray-100 hover:to-primary-100 rounded-lg text-sm text-gray-700 transition-all border border-gray-200 hover:border-primary-300"
                    >
                      <span className="text-primary-600 mr-2">→</span>
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div
                  className={`inline-block max-w-[70%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                  <p className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-primary-200' : 'text-gray-500'
                  }`}>
                    {message.timestamp && !isNaN(new Date(message.timestamp)) 
                      ? format(new Date(message.timestamp), 'h:mm a')
                      : 'Just now'}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-left mb-4">
                <div className="inline-block bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={t('seebaAI.placeholder')}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('common.send')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskAI;