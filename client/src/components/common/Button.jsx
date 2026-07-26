import { motion } from 'framer-motion';

const variants = {
  primary:
    'btn-primary px-6 py-3 rounded-xl font-semibold text-white',
  secondary:
    'btn-secondary px-6 py-3 rounded-xl font-semibold',
  ghost:
    'px-6 py-3 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors',
  danger:
    'px-6 py-3 rounded-xl font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors',
};

const sizes = {
  sm: '!px-4 !py-2 text-sm',
  md: '',
  lg: '!px-8 !py-4 text-lg',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${variants[variant]} ${sizes[size]} ${
        disabled || loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
      } inline-flex items-center justify-center gap-2 ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </motion.button>
  );
};

export default Button;
