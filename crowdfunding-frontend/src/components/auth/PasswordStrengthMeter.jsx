import React from 'react';

const PasswordStrengthMeter = ({ password }) => {
  // Simple strength calculation
  const strength = password.length > 8 ? 'strong' : password.length > 4 ? 'medium' : 'weak';

  return (
    <div className="password-strength">
      <div className={`strength-bar ${strength}`}></div>
      <span>Password strength: {strength}</span>
    </div>
  );
};

export default PasswordStrengthMeter;