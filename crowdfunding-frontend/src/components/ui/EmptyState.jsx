import React from 'react';

const EmptyState = ({ message, action }) => {
  return (
    <div className="empty-state">
      <p>{message}</p>
      {action}
    </div>
  );
};

export default EmptyState;