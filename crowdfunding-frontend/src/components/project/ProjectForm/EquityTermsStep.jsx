import React from 'react';
import Input from '../../common/Input';

const EquityTermsStep = ({ data, onChange }) => {
  return (
    <div>
      <Input
        type="number"
        placeholder="Equity Percentage"
        value={data.equityPercentage}
        onChange={(e) => onChange({ ...data, equityPercentage: e.target.value })}
      />
      <Input
        type="number"
        placeholder="Valuation"
        value={data.valuation}
        onChange={(e) => onChange({ ...data, valuation: e.target.value })}
      />
    </div>
  );
};

export default EquityTermsStep;