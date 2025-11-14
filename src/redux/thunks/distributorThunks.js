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
export const fetchDistributorById = createAsyncThunk('distributorData/fetchDistributorById', async (distributorId, { rejectWithValue }) => {
    try {
        const response = await api.get(`/distributors/${distributorId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching distributor with ID ${distributorId}:`, error);
        return rejectWithValue(
            error.response?.data?.message || error.message || `Failed to fetch distributor with ID ${distributorId}`
        ); 
    }
})