import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Fetch all distributors
export const fetchAllDistributors = createAsyncThunk(
  'distributorData/fetchAllDistributors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/distributors');
      return response.data;
    } catch (error) {
      console.error('Error fetching all distributors:', error);
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch distributors',
      );
    }
  },
);

export const fetchDistributorByUsercode = createAsyncThunk(
  'distributorData/fetchDistributorByUsercode',
  async (distributorCode, { rejectWithValue }) => {
    try {
      const response = await api.get(`/distributors/${distributorCode}`);

      const d = response.data?.data;

      const normalized = {
        customer_code: d.CUSTOMER_CODE,
        customer_name: d.CUSTOMER_NAME,
        mobile_number: d.MOBILE_NUMBER,
        customer_type: d.CUSTOMER_TYPE,
        email: d.EMAIL,
        password: d.PASSWORD || '', // never send password from backend
      };

      return normalized;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);
