import React, { useState } from 'react';
import Input from '../../common/Input';
import Textarea from '../../common/Textarea';

const BasicInfoStep = ({ data, onChange }) => {
  return (
    <div>
      <Input
        placeholder="Project Title"
        value={data.title}
        onChange={(e) => onChange({ ...data, title: e.target.value })}
      />
      <Textarea
        placeholder="Short Description"
        value={data.shortDescription}
        onChange={(e) => onChange({ ...data, shortDescription: e.target.value })}
      />
    </div>
  );
};

export default BasicInfoStep;