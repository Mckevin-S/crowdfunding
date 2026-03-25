import React from 'react';
import Textarea from '../../common/Textarea';

const DescriptionStep = ({ data, onChange }) => {
  return (
    <div>
      <Textarea
        placeholder="Full Description"
        value={data.description}
        onChange={(e) => onChange({ ...data, description: e.target.value })}
        rows={10}
      />
    </div>
  );
};

export default DescriptionStep;