import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Fetch all Corporates
export const fetchAllCorporates = createAsyncThunk('corporateData/fetchAllCorporates', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/corporates');
        return response.data;
    } catch (error) {
        console.error("Error fetching all corporates:", error);
        return rejectWithValue(
            error.response?.data?.message || error.message || 'Failed to fetch corporates'
        );
    }
});

export const fetchCorporateById = createAsyncThunk('corporateData/fetchCorporateById', async (corporateId, { rejectWithValue }) => {
    try {
        const response = await api.get(`/corporates/${corporateId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching corporate with ID ${corporateId}`, error);
        return rejectWithValue(
            error.response?.data?.message || error.message || `Failed to fetch corporate with ID ${corporateId}`
        );
    }
})