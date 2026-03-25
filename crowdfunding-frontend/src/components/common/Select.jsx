import React from 'react';
import clsx from 'clsx';

const Select = ({ 
  label, 
  options = [], 
  error, 
  touched, 
  className = '', 
  leftIcon,
  ...props 
}) => {
  return (
    <div className={clsx('w-full flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-sm font-bold text-neutral-rich ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors pointer-events-none">
            {leftIcon}
          </div>
        )}
        <select
          className={clsx(
            'w-full px-4 py-3 bg-white border rounded-xl appearance-none outline-none transition-all duration-300',
            leftIcon ? 'pl-12' : 'pl-4',
            error && touched
              ? 'border-red-500 ring-red-100 ring-4'
              : 'border-gray-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-50 shadow-sm'
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && touched && (
        <span className="text-xs font-bold text-red-500 ml-1 mt-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default Select;