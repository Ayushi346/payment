import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      return Promise.reject({
        message: error.response.data?.message || 'An error occurred',
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        status: null,
      });
    } else {
      // Something else happened
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
        status: null,
      });
    }
  }
);

// API methods
export const customerAPI = {
  login: async (accountNumber, mobile) => {
    const response = await api.post('/customers/login', {
      account_number: accountNumber,
      mobile: mobile,
    });
    return response.data;
  },

  getCustomer: async (accountNumber) => {
    const response = await api.get(`/customers/${accountNumber}`);
    return response.data;
  },
};

export const paymentAPI = {
  createPayment: async (customerAccountNumber, amount) => {
    const response = await api.post('/payments', {
      customer_account_number: customerAccountNumber,
      amount: amount,
    });
    return response.data;
  },

  getPaymentHistory: async (accountNumber) => {
    const response = await api.get(`/payments/${accountNumber}`);
    return response.data;
  },
};

export default api;

