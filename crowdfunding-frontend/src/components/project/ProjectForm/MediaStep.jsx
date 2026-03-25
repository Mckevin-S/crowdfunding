import React from 'react';

const MediaStep = ({ data, onChange }) => {
  return (
    <div>
      <input
        type="file"
        multiple
        onChange={(e) => onChange({ ...data, media: e.target.files })}
      />
    </div>
  );
};

export default MediaStep;