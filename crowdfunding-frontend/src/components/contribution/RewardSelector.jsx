import React from 'react';
import Select from '../common/Select';

const RewardSelector = ({ rewards, selectedReward, onChange }) => {
  const options = rewards.map((reward) => ({ value: reward.id, label: reward.title }));

  return (
    <Select
      options={options}
      value={selectedReward}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Select a Reward"
    />
  );
};

export default RewardSelector;