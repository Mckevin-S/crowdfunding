import React from 'react';
import Input from '../../common/Input';

const LoanTermsStep = ({ data, onChange }) => {
  return (
    <div>
      <Input
        type="number"
        placeholder="Interest Rate (%)"
        value={data.interestRate}
        onChange={(e) => onChange({ ...data, interestRate: e.target.value })}
      />
      <Input
        type="number"
        placeholder="Loan Term (months)"
        value={data.loanTerm}
        onChange={(e) => onChange({ ...data, loanTerm: e.target.value })}
      />
    </div>
  );
};

export default LoanTermsStep;