import { createSlice } from "@reduxjs/toolkit";
import { fetchAllCorporates, fetchCorporateById } from "../thunks/corporateThunks";

// initial state
const initialState = {
    corporateData: {
        username: '',
        mobile_number: '',
        email: '',
        password: ''
    },
    mode: 'create',
    loading: false,
    error: null
};

// slice
const corporateSlice = createSlice({
    name: 'corporateData',
    initialState,
    reducers: {
        setModeCorporateData: (state, action) => {
            state.mode = action.payload;
            if (action.payload === 'create') {
                state.corporateData = { ...initialState.corporateData };
            }
        },
        updateFieldCorporateData: (state, action) => {
            const { name, value } = action.payload;
            state.corporateData[name] = value;
        }
    },
    extraReducers: (builder) => {
        const handleError = (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        };
        builder
        .addCase(fetchAllCorporates.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAllCorporates.fulfilled, (state, action) => {
            state.loading = true;
            state.corporateData = action.payload;
        })
        .addCase(fetchAllCorporates.rejected, handleError)
        .addCase(fetchCorporateById.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchCorporateById.fulfilled, (state, action) => {
            state.loading = false;
            state.corporateData = action.payload;
        })
        .addCase(fetchCorporateById.rejected, handleError);
    }
})

export const { setModeCorporateData, updateFieldCorporateData } = corporateSlice.actions;
export default corporateSlice.reducer;