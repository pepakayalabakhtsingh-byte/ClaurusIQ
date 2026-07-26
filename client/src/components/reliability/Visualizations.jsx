import { motion } from 'framer-motion';

export const AnimatedGauge = ({ value, label, colorClass, bgClass }) => {
  const percentage = Math.max(0, Math.min(100, value));
  
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle 
            cx="50" cy="50" r="40" 
            stroke="currentColor" 
            strokeWidth="8" 
            fill="transparent" 
            className={`text-slate-100 dark:text-slate-800 ${bgClass}`}
          />
          {/* Progress Circle */}
          <motion.circle 
            cx="50" cy="50" r="40" 
            stroke="currentColor" 
            strokeWidth="8" 
            fill="transparent"
            strokeDasharray="251.2"
            strokeDashoffset="251.2"
            strokeLinecap="round"
            className={colorClass}
            initial={{ strokeDashoffset: 251.2 }}
            animate={{ strokeDashoffset: 251.2 - (251.2 * percentage) / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-slate-900 dark:text-white">{percentage}%</span>
        </div>
      </div>
      <div className="mt-3 text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-center">
        {label}
      </div>
    </div>
  );
};

export const ProgressBar = ({ label, value, max = 100, colorClass }) => {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div className="mb-4">
      <div className="flex justify-between items-end mb-1">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
        <span className="text-sm font-black text-slate-700 dark:text-slate-300">{value}</span>
      </div>
      <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div 
          className={`h-full rounded-full ${colorClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};
