import React from 'react';
import Input from '../../common/Input';
import Select from '../../common/Select';

const FinancialStep = ({ data, onChange }) => {
  const fundingTypes = [
    { value: 'REWARD', label: 'Reward-based' },
    { value: 'LOAN', label: 'Loan-based' },
    { value: 'EQUITY', label: 'Equity-based' },
  ];

  return (
    <div>
      <Select
        options={fundingTypes}
        value={data.fundingType}
        onChange={(e) => onChange({ ...data, fundingType: e.target.value })}
        placeholder="Select Funding Type"
      />
      <Input
        type="number"
        placeholder="Goal Amount"
        value={data.goal}
        onChange={(e) => onChange({ ...data, goal: e.target.value })}
      />
    </div>
  );
};

export default FinancialStep;