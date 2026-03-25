import React from 'react';

const ProjectUpdates = ({ updates }) => {
  return (
    <div className="project-updates">
      {updates.map((update) => (
        <div key={update.id}>
          <h4>{update.title}</h4>
          <p>{update.content}</p>
        </div>
      ))}
    </div>
  );
};

export default ProjectUpdates;