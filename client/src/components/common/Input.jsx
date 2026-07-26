import { forwardRef } from 'react';

const Input = forwardRef(
  (
    {
      label,
      error,
      type = 'text',
      className = '',
      icon: Icon,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200
              bg-white dark:bg-slate-800/50
              border-slate-200 dark:border-slate-700
              text-slate-900 dark:text-slate-100
              placeholder:text-slate-400 dark:placeholder:text-slate-500
              focus:border-primary-500 dark:focus:border-primary-500
              focus:ring-2 focus:ring-primary-500/20
              ${Icon ? 'pl-11' : ''}
              ${error ? 'border-red-400 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
              ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
