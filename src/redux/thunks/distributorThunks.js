import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Fetch all distributors
export const fetchAllDistributors = createAsyncThunk('distributorData/fetchAllDistributors', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/distributors');
        return response.data;
    } catch (error) {
        console.error('Error fetching all distributors:', error);
        return rejectWithValue(
            error.response?.data?.message || error.message || 'Failed to fetch distributors'
        );
    }
});

// fetch specific distributor by id
export const fetchDistributorByUsercode = createAsyncThunk('distributorData/fetchDistributorByUsercode', async (distributorCode, { rejectWithValue }) => {
    try {
        const response = await api.get(`/distributors/${distributorCode}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching distributor with Code ${distributorCode}:`, error);
        return rejectWithValue(
            error.response?.data?.message || error.message || `Failed to fetch distributor with Usercode ${distributorCode}`
        ); 
    }
})