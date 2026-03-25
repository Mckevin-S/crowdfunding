import React from 'react';

const ContributionSummary = ({ contribution }) => {
  return (
    <div className="contribution-summary">
      <p>Amount: ${contribution.amount}</p>
      <p>Date: {contribution.date}</p>
      <p>Status: {contribution.status}</p>
    </div>
  );
};

export default ContributionSummary;