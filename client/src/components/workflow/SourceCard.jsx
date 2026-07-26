import { motion } from 'framer-motion';
import { HiOutlineExternalLink, HiOutlineBookmark, HiOutlineBadgeCheck } from 'react-icons/hi';

const SourceCard = ({ source, index }) => {
  if (!source) return null;

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-100 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/20 dark:border-emerald-500/30';
    if (score >= 70) return 'text-blue-600 bg-blue-100 border-blue-200 dark:text-blue-400 dark:bg-blue-500/20 dark:border-blue-500/30';
    if (score >= 50) return 'text-amber-600 bg-amber-100 border-amber-200 dark:text-amber-400 dark:bg-amber-500/20 dark:border-amber-500/30';
    return 'text-red-600 bg-red-100 border-red-200 dark:text-red-400 dark:bg-red-500/20 dark:border-red-500/30';
  };

  const scoreClass = getScoreColor(source.credibilityScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 group"
    >
      <div className="flex justify-between items-start mb-3 gap-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight line-clamp-2 flex-1 group-hover:text-primary-500 transition-colors">
          {source.title}
        </h3>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold shrink-0 ${scoreClass}`}>
          <HiOutlineBadgeCheck className="w-4 h-4" />
          {source.credibilityScore}
        </div>
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed">
        {source.summary}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/50">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-500">
          <span className="font-medium text-slate-700 dark:text-slate-300 max-w-[150px] truncate" title={source.author}>
            {source.author}
          </span>
          <span>•</span>
          <span className="uppercase tracking-wider">{source.sourceType}</span>
          <span>•</span>
          <span>{source.year}</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-lg transition-colors" title="Save Bookmark">
            <HiOutlineBookmark className="w-5 h-5" />
          </button>
          <a 
            href={source.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
          >
            Open <HiOutlineExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default SourceCard;
