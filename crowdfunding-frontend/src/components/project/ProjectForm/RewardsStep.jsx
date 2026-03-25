import React from 'react';
import Input from '../../common/Input';
import Textarea from '../../common/Textarea';

const RewardsStep = ({ data, onChange }) => {
  return (
    <div>
      <Input
        placeholder="Reward Title"
        value={data.rewardTitle}
        onChange={(e) => onChange({ ...data, rewardTitle: e.target.value })}
      />
      <Textarea
        placeholder="Reward Description"
        value={data.rewardDescription}
        onChange={(e) => onChange({ ...data, rewardDescription: e.target.value })}
      />
      <Input
        type="number"
        placeholder="Minimum Contribution"
        value={data.minContribution}
        onChange={(e) => onChange({ ...data, minContribution: e.target.value })}
      />
    </div>
  );
};

export default RewardsStep;