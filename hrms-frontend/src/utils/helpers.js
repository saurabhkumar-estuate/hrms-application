import { format, parseISO } from 'date-fns';

export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    return format(parseISO(dateStr), 'dd MMM yyyy');
  } catch {
    return dateStr;
  }
};

export const formatCurrency = (amount) => {
  if (amount == null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getStatusBadgeClass = (status) => {
  const classes = {
    ACTIVE: 'badge-green',
    APPROVED: 'badge-green',
    PRESENT: 'badge-green',
    PAID: 'badge-green',
    INACTIVE: 'badge-red',
    REJECTED: 'badge-red',
    ABSENT: 'badge-red',
    PENDING: 'badge-yellow',
    LATE: 'badge-yellow',
    PROCESSED: 'badge-blue',
    HALF_DAY: 'badge-yellow',
    ON_LEAVE: 'badge-gray',
  };
  return classes[status] || 'badge-gray';
};

export const getMonthName = (month) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month - 1] || '';
};

export const hasRole = (user, ...roles) => {
  return roles.includes(user?.role);
};

export const isAdminOrHR = (user) => {
  return hasRole(user, 'ADMIN', 'HR_MANAGER');
};
