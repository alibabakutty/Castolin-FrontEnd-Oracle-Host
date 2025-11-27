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

export const fetchCorporateByUsercode = createAsyncThunk('corporateData/fetchCorporateByUsercode', async (directOrderCode, { rejectWithValue }) => {
    try {
        const response = await api.get(`/corporates/${directOrderCode}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching direct order with Usercode ${directOrderCode}`, error);
        return rejectWithValue(
            error.response?.data?.message || error.message || `Failed to fetch corporate with Usercode ${directOrderCode}`
        );
    }
})