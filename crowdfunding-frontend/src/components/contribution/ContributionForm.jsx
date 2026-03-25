import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const ContributionForm = ({ projectId, onSubmit }) => {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ projectId, amount: parseFloat(amount) });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="number"
        placeholder="Contribution Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button type="submit">Contribute</Button>
    </form>
  );
};

export default ContributionForm;