import React from 'react';

const PaymentSuccess = ({ transactionId }) => {
  return (
    <div className="payment-success">
      <h2>Payment Successful!</h2>
      <p>Transaction ID: {transactionId}</p>
    </div>
  );
};

export default PaymentSuccess;