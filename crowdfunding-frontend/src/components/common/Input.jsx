import React from 'react';
import clsx from 'clsx';

const Input = ({ 
  label, 
  error, 
  touched, 
  className = '', 
  leftIcon, 
  rightIcon,
  required = false,
  ...props 
}) => {
  return (
    <div className={clsx('w-full flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-sm font-bold text-slate-700 ml-1 flex gap-1">
          {label}
          {required && <span className="text-primary-500">*</span>}
        </label>
      )}
      <div className="relative group">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          className={clsx(
            'input-premium',
            leftIcon && 'pl-11',
            rightIcon && 'pr-11',
            error && touched && 'border-red-500 ring-red-100 ring-4'
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
      {error && touched && (
        <span className="text-xs font-bold text-red-500 ml-1 mt-1 animate-in fade-in slide-in-from-top-1 duration-300">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;