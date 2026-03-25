import React from 'react';

const Alert = ({ type = 'info', message, onClose }) => {
  return (
    <div className={`alert ${type}`}>
      {message}
      {onClose && <button onClick={onClose}>×</button>}
    </div>
  );
};

export default Alert;