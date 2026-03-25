import React from 'react';

const ProjectStats = ({ project }) => {
  return (
    <div className="project-stats">
      <p>Backers: {project.backers}</p>
      <p>Days left: {project.daysLeft}</p>
    </div>
  );
};

export default ProjectStats;