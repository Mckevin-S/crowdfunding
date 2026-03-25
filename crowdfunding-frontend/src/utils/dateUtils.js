import { format, formatDistanceToNow, parseISO } from 'date-fns';

export const formatDateTime = (date) => {
  return format(new Date(date), 'PPP p');
};

export const timeAgo = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const isDateInPast = (date) => {
  return new Date(date) < new Date();
};