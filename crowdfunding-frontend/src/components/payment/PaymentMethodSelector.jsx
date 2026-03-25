import React from 'react';
import Button from '../common/Button';

const PaymentMethodSelector = ({ methods, selectedMethod, onChange }) => {
  return (
    <div>
      {methods.map((method) => (
        <Button
          key={method.id}
          onClick={() => onChange(method.id)}
          className={selectedMethod === method.id ? 'selected' : ''}
        >
          {method.name}
        </Button>
      ))}
    </div>
  );
};

export default PaymentMethodSelector;