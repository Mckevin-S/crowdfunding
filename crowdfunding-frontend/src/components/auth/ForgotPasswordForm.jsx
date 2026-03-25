import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle forgot password logic
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button type="submit">Reset Password</Button>
    </form>
  );
};

export default ForgotPasswordForm;