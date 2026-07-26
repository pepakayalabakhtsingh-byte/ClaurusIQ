import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineClipboardCopy,
  HiOutlineExternalLink,
  HiOutlineShieldCheck,
  HiOutlineChevronDown
} from 'react-icons/hi';

const SourceCard = ({ source, index }) => {
  const [selectedFormat, setSelectedFormat] = useState('apa');
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(source.formats[selectedFormat]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCredibilityColor = (level) => {
    switch(level) {
      case 'Excellent':
      case 'Very High': return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30';
      case 'High': return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30';
      case 'Medium': return 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30';
      default: return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-500/10 border-red-200 dark:border-red-500/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 relative group"
    >
      <div className="flex justify-between items-start gap-4 mb-3">
        <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight group-hover:text-primary-500 transition-colors line-clamp-2">
          {source.title}
        </h3>
        <div className={`px-3 py-1 rounded-full border text-xs font-bold whitespace-nowrap flex flex-col items-center justify-center shrink-0 ${getCredibilityColor(source.credibilityLevel)}`}>
          <span>Score</span>
          <span className="text-lg">{source.trustScore}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-5">
        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{source.sourceCategory}</span>
        <span>•</span>
        <span>{source.author}</span>
        <span>•</span>
        <span>{source.year}</span>
        {source.doi && (
          <>
            <span>•</span>
            <span className="text-primary-500">DOI: {source.doi}</span>
          </>
        )}
      </div>

      {/* Citation Box */}
      <div className="bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex space-x-2">
            {['apa', 'mla', 'ieee', 'chicago', 'harvard', 'bibtex', 'ris'].map(format => (
              <button
                key={format}
                onClick={() => setSelectedFormat(format)}
                className={`text-xs font-bold uppercase px-3 py-1.5 rounded-lg transition-colors ${
                  selectedFormat === format 
                  ? 'bg-primary-500 text-white' 
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {format}
              </button>
            ))}
          </div>
          <button 
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-primary-500 transition-colors"
          >
            {copied ? <span className="text-emerald-500">Copied!</span> : <><HiOutlineClipboardCopy className="w-4 h-4"/> Copy</>}
          </button>
        </div>
        
        <div className="p-4 text-sm text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap break-words">
          {source.formats[selectedFormat]}
        </div>
      </div>

      {/* Footer Links & Expand */}
      <div className="flex justify-between items-center mt-4">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-bold text-slate-500 hover:text-primary-500 flex items-center gap-1 transition-colors"
        >
          Trust Evaluation <HiOutlineChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}/>
        </button>

        {source.url && (
          <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors">
            View Source <HiOutlineExternalLink />
          </a>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-4 pt-4 border-t border-slate-100 dark:border-slate-800"
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
              <HiOutlineShieldCheck className="w-4 h-4 text-primary-500" />
              Evaluation Rationale
            </h4>
            <div className="text-sm font-mono text-slate-600 dark:text-slate-400 whitespace-pre-wrap bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50">
              {source.trustRationale}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default SourceCard;
