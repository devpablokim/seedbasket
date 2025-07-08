import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const AskAI = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  const sampleQuestions = [
    "Why did QQQ price change today?",
    "What's the difference between QQQ and TQQQ?",
    "Which ETFs performed best today?",
    "Explain the current market sentiment",
    "What major financial news came out today?"
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
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/ai/conversations`);
      console.log('Fetched conversations:', response.data);
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  };

  const loadConversation = async (conversationId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/ai/conversations/${conversationId}`);
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
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/ai/chat`, {
        message: message,
        conversationId: currentConversationId
      });

      setMessages(prev => [...prev, response.data.assistantMessage]);
      setCurrentConversationId(response.data.conversationId);
      // 약간의 지연 후 대화 목록 새로고침
      setTimeout(() => {
        fetchConversations();
      }, 500);
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        message: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
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
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/ai/conversations/${conversationId}`);
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
            <h3 className="font-semibold text-gray-900">Conversations</h3>
            <button
              onClick={startNewConversation}
              className="text-sm bg-primary-600 text-white px-3 py-1 rounded hover:bg-primary-700"
            >
              New Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2">
            {conversations.length === 0 ? (
              <div className="text-center text-gray-500 text-sm py-4">
                No conversations yet. Start a new chat!
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
                      {format(new Date(conv.timestamp), 'MMM d, h:mm a')}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conv.id);
                      }}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Delete
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
            <h2 className="text-xl font-semibold text-gray-900">Ask AI Assistant</h2>
            <div className="mt-2 p-3 bg-yellow-50 rounded-md">
              <p className="text-sm text-yellow-800">
                ⚠️ AI responses may be inaccurate. Always fact-check important information independently!
              </p>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Ask me about today's market data and news!
                </h3>
                <div className="space-y-2">
                  {sampleQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(question)}
                      className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
                    >
                      💡 {question}
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
                    {format(new Date(message.timestamp), 'h:mm a')}
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
                placeholder="Ask about market data, ETFs, or financial news..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskAI;