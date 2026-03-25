import React from 'react';
import clsx from 'clsx';

const Textarea = ({ 
  label, 
  error, 
  touched, 
  rows = 4,
  className = '', 
  ...props 
}) => {
  return (
    <div className={clsx('w-full flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-sm font-bold text-neutral-rich ml-1">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={clsx(
          'w-full px-4 py-3 bg-white border rounded-xl outline-none transition-all duration-300 resize-none font-sans',
          error && touched
            ? 'border-red-500 ring-red-100 ring-4'
            : 'border-gray-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-50 shadow-sm'
        )}
        {...props}
      />
      {error && touched && (
        <span className="text-xs font-bold text-red-500 ml-1 mt-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default Textarea;