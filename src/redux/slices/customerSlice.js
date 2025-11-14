import { createSlice } from "@reduxjs/toolkit";
import { fetchAllCustomers, fetchCustomerByCustomerCode } from "../thunks/customerThunks";


// initial state
const initialState = {
    customerData: {
        customer_code: '',
        customer_name: '',
        mobile_number: '',
        email: '',
    },
    mode: 'create',
    loading: false,
    error: null
};

//slice
const customerSlice = createSlice({
    name: 'customerData',
    initialState,
    reducers: {
        setModeCustomerData: (state, action) => {
            state.mode = action.payload;
            if (action.payload === 'create') {
                state.customerData = { ...initialState.customerData };
            }
        },
        updateFieldCustomerData: (state, action) => {
            const { name, value } = action.payload;
            state.customerData[name] = value;
        },
    },
    extraReducers: (builder) => {
        const handleError = (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        };
        builder
        .addCase(fetchAllCustomers.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAllCustomers.fulfilled, (state, action) => {
            state.loading = false;
            state.customerData = action.payload;
        })
        .addCase(fetchAllCustomers.rejected, handleError)
        .addCase(fetchCustomerByCustomerCode.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchCustomerByCustomerCode.fulfilled, (state, action) => {
            state.loading = false;
            state.customerData = action.payload;
        })
        .addCase(fetchCustomerByCustomerCode.rejected, handleError)
    }
})

export const { setModeCustomerData, updateFieldCustomerData } = customerSlice.actions;
export default customerSlice.reducer;