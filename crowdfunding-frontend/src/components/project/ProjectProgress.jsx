import React from 'react';
import clsx from 'clsx';

const ProjectProgress = ({ raised, goal, size = 'md', showPercent = true, className = '' }) => {
  const percentage = Math.min(Math.round((raised / goal) * 100), 100);

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={clsx('w-full', className)}>
      <div className="flex justify-between items-center mb-2">
        {showPercent && (
          <span className="text-sm font-semibold text-primary-600">
            {percentage}% financé
          </span>
        )}
      </div>
      <div className={clsx('w-full bg-gray-100 rounded-full overflow-hidden', heights[size])}>
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-1000 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProjectProgress;