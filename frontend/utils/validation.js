export const validateAccountNumber = (accountNumber) => {
  if (!accountNumber || accountNumber.trim() === '') {
    return 'Account number is required';
  }
  if (accountNumber.trim().length < 3) {
    return 'Account number must be at least 3 characters';
  }
  return null;
};

export const validateMobile = (mobile) => {
  if (!mobile || mobile.trim() === '') {
    return 'Mobile number is required';
  }
  // Basic mobile validation (10 digits)
  const mobileRegex = /^[0-9]{10}$/;
  if (!mobileRegex.test(mobile.trim())) {
    return 'Mobile number must be 10 digits';
  }
  return null;
};

export const validateAmount = (amount) => {
  if (!amount || amount.toString().trim() === '') {
    return 'Payment amount is required';
  }
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) {
    return 'Amount must be a valid number';
  }
  if (numAmount <= 0) {
    return 'Amount must be greater than 0';
  }
  return null;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

