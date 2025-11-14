import { createSlice } from "@reduxjs/toolkit";
import { fetchAllStockItems, fetchStockItemByItemCode } from "../thunks/stockItemThunks";

// initial state
const initialState = {
    stockItemData: {
        itemCode: '',
        stockItemName: '',
        hsnCode: '',
        gst: '',
        uom: '',
        rate: '',
    },
    mode: 'create',
    loading: false,
    error: null
};

//slice
const stockItemSlice = createSlice({
    name: 'stockItemData',
    initialState,
    reducers: {
        setModeStockItemData: (state, action) => {
            state.mode = action.payload;
            if (action.payload === 'create') {
                state.stockItemData = { ...initialState.stockItemData };
            }
        },
        updateFieldStockItemData: (state, action) => {
            const { name, value } = action.payload;
            state.stockItemData[name] = value;
        }
    },
    extraReducers: (builder) => {
        const handleError = (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        };
        builder
            .addCase(fetchAllStockItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllStockItems.fulfilled, (state, action) => {
                state.loading = false;
                state.stockItemData = action.payload;
            })
            .addCase(fetchAllStockItems.rejected, handleError)
            .addCase(fetchStockItemByItemCode.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStockItemByItemCode.fulfilled, (state, action) => {
                state.loading = false;
                state.stockItemData = action.payload;
            })
            .addCase(fetchStockItemByItemCode.rejected, handleError);
    },
})

export const { setModeStockItemData, updateFieldStockItemData } = stockItemSlice.actions;
export default stockItemSlice.reducer;