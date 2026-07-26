import { useTheme } from '../../context/ThemeContext';
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';
import { motion } from 'framer-motion';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={`p-2 rounded-xl transition-colors cursor-pointer
        bg-slate-100 dark:bg-slate-800 
        hover:bg-slate-200 dark:hover:bg-slate-700
        text-slate-600 dark:text-slate-300
        ${className}`}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'dark' ? (
          <HiOutlineSun className="w-5 h-5" />
        ) : (
          <HiOutlineMoon className="w-5 h-5" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
