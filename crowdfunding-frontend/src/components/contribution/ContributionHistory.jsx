import React from 'react';
import ContributionSummary from './ContributionSummary';

const ContributionHistory = ({ contributions }) => {
  return (
    <div className="contribution-history">
      {contributions.map((contribution) => (
        <ContributionSummary key={contribution.id} contribution={contribution} />
      ))}
    </div>
  );
};

export default ContributionHistory;