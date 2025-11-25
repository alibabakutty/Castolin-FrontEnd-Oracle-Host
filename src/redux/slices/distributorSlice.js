import { createSlice } from "@reduxjs/toolkit";
import { fetchAllDistributors, fetchDistributorById } from "../thunks/distributorThunks";

// initial state
const initialState = {
    distributorData: {
        usercode: '',
        username: '',
        mobile_number: '',
        email: '',
        password: '',
    },
    mode: 'create',
    loading: false,
    error: null
};

// slice
const distributorSlice = createSlice({
    name: 'distributorData',
    initialState,
    reducers: {
        setModeDistributorData: (state, action) => {
            state.mode = action.payload;
            if (action.payload === 'create') {
                state.distributorData = { ...initialState.distributorData };
            }
        },
        updateFieldDistributorData: (state, action) => {
            const { name, value } = action.payload;
            state.distributorData[name] = value;
        }
    },
    extraReducers: (builder) => {
        const handleError = (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        };
        builder
            .addCase(fetchAllDistributors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllDistributors.fulfilled, (state, action) => {
                state.loading = false;
                state.distributorData = action.payload;
            })
            .addCase(fetchAllDistributors.rejected, handleError)
            .addCase(fetchDistributorById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDistributorById.fulfilled, (state, action) => {
                state.loading = false;
                state.distributorData = action.payload;
            })
            .addCase(fetchDistributorById.rejected, handleError);
    }
})

export const { setModeDistributorData, updateFieldDistributorData } = distributorSlice.actions;
export default distributorSlice.reducer;