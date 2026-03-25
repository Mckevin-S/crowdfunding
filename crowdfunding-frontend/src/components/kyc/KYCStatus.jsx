import React from 'react';
import Badge from '../common/Badge';

const KYCStatus = ({ status }) => {
  return (
    <div>
      <Badge text={status} variant={status === 'VERIFIED' ? 'success' : 'warning'} />
    </div>
  );
};

export default KYCStatus;