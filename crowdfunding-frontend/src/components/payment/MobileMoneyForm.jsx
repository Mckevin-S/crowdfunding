import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const MobileMoneyForm = ({ onSubmit }) => {
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ phone });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <Button type="submit">Pay with Mobile Money</Button>
    </form>
  );
};

export default MobileMoneyForm;