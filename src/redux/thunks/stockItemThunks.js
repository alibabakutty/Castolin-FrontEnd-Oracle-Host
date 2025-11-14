import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// fetch all inventory items
export const fetchAllStockItems = createAsyncThunk(
    'stockItemData/fetchAllStockItems',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/stock_item');
            return response.data;
        } catch (error) {
            console.error('Error fetching all stock items:', error);
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to fetch stock items'
            )
        }
    }
);

// Fetch stock item by item code
export const fetchStockItemByItemCode = createAsyncThunk('stockItemData/fetchStockItemByItemCode', async (itemCode, { rejectWithValue }) => {
    try {
        const response = await api.get(`/stock_item/${itemCode}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching stock item with ID ${itemCode}`, error);
        return rejectWithValue(
            error.response?.data?.message || error.message || `Failed to fetch stock item with Code ${itemCode}`
        );
    }
});