import React from 'react';
import clsx from 'clsx';

const Card = ({ 
  children, 
  title, 
  className = '', 
  padding = 'p-6', 
  hoverable = false,
  onClick,
  footer
}) => {
  return (
    <div 
      className={clsx(
        'card-premium flex flex-col overflow-hidden',
        hoverable && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {title && (
        <div className="px-6 py-4 border-b border-gray-50">
          <h3 className="font-display font-bold text-lg text-slate-900">{title}</h3>
        </div>
      )}
      <div className={clsx('flex-grow', padding)}>
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;