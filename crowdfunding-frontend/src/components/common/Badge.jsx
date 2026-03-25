import React from 'react';
import clsx from 'clsx';

const Badge = ({ 
  children, 
  variant = 'primary', 
  className = '' 
}) => {
  const variants = {
    primary: 'bg-primary-500 text-white',
    secondary: 'bg-primary-900 text-white',
    success: 'bg-emerald-50 text-emerald-600',
    outline: 'border border-gray-100 text-slate-500',
  };

  return (
    <span className={clsx(
      'px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};

export default Badge;