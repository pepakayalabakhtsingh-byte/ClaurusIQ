import { motion } from 'framer-motion';
import { HiOutlineShieldCheck, HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi';
import { useState } from 'react';

const ChatMessage = ({ message }) => {
  const [showReasoning, setShowReasoning] = useState(false);
  const isUser = message.role === 'user';
  const meta = message.metadata || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-5`}
    >
      <div className={`max-w-[75%] ${isUser ? 'order-2' : ''}`}>
        {/* Message Bubble */}
        <div className={`rounded-2xl px-5 py-4 shadow-sm ${
          isUser
            ? 'bg-primary-500 text-white rounded-br-md'
            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-md'
        }`}>
          {/* Evidence badge */}
          {!isUser && meta.isEvidenceBased && (
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
              <HiOutlineShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Evidence-Based Answer</span>
              {meta.confidence != null && (
                <span className="text-xs font-bold text-slate-400 ml-auto">
                  Confidence: {meta.confidence}/100
                </span>
              )}
            </div>
          )}

          {!isUser && !meta.isEvidenceBased && message.content.includes("don't have") && (
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">⚠ General Response — No verified research data available</span>
            </div>
          )}

          <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>

          {/* Sources */}
          {!isUser && meta.sources && meta.sources.length > 0 && (
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700">
              <p className="text-xs font-bold text-slate-400 mb-1">Sources Referenced:</p>
              <div className="flex flex-wrap gap-2">
                {meta.sources.map((s, i) => (
                  <span key={i} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-lg font-medium">
                    {s.title} <span className="text-emerald-500">({s.trustScore})</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Show Reasoning toggle */}
        {!isUser && meta.reasoningTrace && (
          <button
            onClick={() => setShowReasoning(!showReasoning)}
            className="mt-2 flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            {showReasoning ? <HiOutlineChevronUp className="w-3 h-3" /> : <HiOutlineChevronDown className="w-3 h-3" />}
            {showReasoning ? 'Hide Reasoning' : 'Show Reasoning'}
          </button>
        )}

        {showReasoning && meta.reasoningTrace && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2 bg-slate-50 dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-800 text-xs text-slate-500"
          >
            <p><strong>Topic:</strong> {meta.reasoningTrace.topic}</p>
            <p><strong>Intent:</strong> {meta.reasoningTrace.intent}</p>
            <p><strong>Evidence Used:</strong> {meta.reasoningTrace.evidenceCount} claims</p>
            <p><strong>Citations Used:</strong> {meta.reasoningTrace.citationCount} sources</p>
            <p><strong>Reliability:</strong> {meta.reasoningTrace.reliabilityScore ?? 'N/A'}/100</p>
          </motion.div>
        )}

        {/* Timestamp */}
        <p className={`text-[10px] mt-1 ${isUser ? 'text-right' : 'text-left'} text-slate-400`}>
          {new Date(message.timestamp).toLocaleTimeString()}
          {meta.processingTimeMs ? ` · ${meta.processingTimeMs}ms` : ''}
        </p>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
