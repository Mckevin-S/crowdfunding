export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

export const FUNDING_TYPES = {
  REWARD: 'REWARD',
  LOAN: 'LOAN',
  EQUITY: 'EQUITY',
};

export const USER_ROLES = {
  CONTRIBUTOR: 'CONTRIBUTOR',
  CREATOR: 'CREATOR',
  INVESTOR: 'INVESTOR',
  ADMIN: 'ADMIN',
};