import React from 'react';
import Button from '../common/Button';

const StripeCheckout = ({ amount, onSuccess }) => {
  const handleCheckout = () => {
    // Integrate with Stripe
    onSuccess();
  };

  return (
    <div>
      <p>Amount: ${amount}</p>
      <Button onClick={handleCheckout}>Pay with Stripe</Button>
    </div>
  );
};

export default StripeCheckout;