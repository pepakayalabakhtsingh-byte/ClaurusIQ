import { useState, useRef, useEffect } from 'react';
import { HiOutlinePaperAirplane } from 'react-icons/hi';
import api from '../services/api';
import ChatMessage from '../components/chat/ChatMessage';
import ChatSidebar from '../components/chat/ChatSidebar';
import SuggestedPrompts from '../components/chat/SuggestedPrompts';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewChat = () => {
    setMessages([]);
    setConversationId(null);
    setSuggestions([]);
  };

  const handleSelectConversation = async (id) => {
    try {
      const res = await api.get(`/chat/${id}`);
      const conv = res.data.data;
      setConversationId(conv._id);
      setMessages(conv.messages || []);

      // Get suggestions from last assistant message
      const lastAssistant = [...(conv.messages || [])].reverse().find(m => m.role === 'assistant');
      setSuggestions(lastAssistant?.metadata?.suggestedQuestions || []);
    } catch (err) {
      console.error('Failed to load conversation', err);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMessage = { role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setSuggestions([]);

    try {
      const res = await api.post('/chat/message', {
        conversationId,
        message: text,
      });

      const { response, conversationId: newId } = res.data.data;
      if (!conversationId) setConversationId(newId);

      const assistantMessage = {
        role: 'assistant',
        content: response.text,
        metadata: {
          isEvidenceBased: response.isEvidenceBased,
          confidence: response.confidence,
          consensusLevel: response.consensusLevel,
          sources: response.sources,
          reasoningTrace: response.reasoningTrace,
          suggestedQuestions: response.suggestedQuestions,
          processingTimeMs: res.data.data.processingTimeMs,
        },
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setSuggestions(response.suggestedQuestions || []);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'An error occurred while processing your request. Please try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="h-full flex overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <ChatSidebar
        activeId={conversationId}
        onSelect={handleSelectConversation}
        onNewChat={handleNewChat}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 shrink-0">
          <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">AI Research Assistant</h1>
          <p className="text-xs text-slate-500 font-medium">Evidence-aware answers based on your verified research</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-4">
                <span className="text-3xl text-white">✦</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">ClaurusIQ Research Assistant</h2>
              <p className="text-slate-500 text-sm max-w-md mb-6">
                Ask questions about your research. I'll answer using verified evidence, citations, and reliability data from your workflows.
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {['Summarize my latest research', 'Show the strongest evidence', 'How reliable is the research?', 'What are the recommendations?'].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(prompt)}
                    className="text-xs font-medium px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary-400 hover:text-primary-600 transition-colors cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <ChatMessage key={i} message={msg} />
          ))}

          {loading && (
            <div className="flex justify-start mb-4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-bl-md px-5 py-4 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        <SuggestedPrompts suggestions={suggestions} onSelect={sendMessage} />

        {/* Input Bar */}
        <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 shrink-0">
          <form onSubmit={handleSubmit} className="flex gap-3 max-w-4xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your research..."
              disabled={loading}
              className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-primary-500 text-white p-3 rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <HiOutlinePaperAirplane className="w-5 h-5 rotate-90" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
