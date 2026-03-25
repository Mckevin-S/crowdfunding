import React from 'react';

const ContributorsList = ({ contributors }) => {
  return (
    <div className="contributors-list">
      {contributors.map((contributor) => (
        <div key={contributor.id}>
          <p>{contributor.name}</p>
        </div>
      ))}
    </div>
  );
};

export default ContributorsList;