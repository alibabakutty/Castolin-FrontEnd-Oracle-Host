import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Fetch ALL customers
export const fetchAllCustomers = createAsyncThunk(
  'customerData/fetchAllCustomers', 
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/customer');
      return response.data;
    } catch (error) {
      console.error('Error fetching all customers:', error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch customers'
      );
    }
  }
);

// Fetch specific customer by Customer Code
export const fetchCustomerByCustomerCode = createAsyncThunk(
  'customerData/fetchCustomerByCustomerCode',
  async (customerCode, { rejectWithValue }) => {
    try {
      const response = await api.get(`/customer/${customerCode}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer with ID ${customerCode}:`, error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        `Failed to fetch customer with Code ${customerCode}`
      );
    }
  }
);