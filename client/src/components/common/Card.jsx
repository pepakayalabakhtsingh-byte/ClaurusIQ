import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  glow = false,
  glass = false,
  hover = true,
  padding = 'p-6',
  ...props
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -2 } : {}}
      transition={{ duration: 0.2 }}
      className={`
        rounded-2xl ${padding}
        ${glass
          ? 'glass'
          : 'bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50'
        }
        ${glow ? 'card-glow' : ''}
        ${hover ? 'transition-shadow hover:shadow-lg dark:hover:shadow-slate-900/50' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
