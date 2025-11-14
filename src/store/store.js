import { configureStore } from "@reduxjs/toolkit";
import stockItemReducer from "../redux/slices/stockItemSlice";
import customerReducer from "../redux/slices/customerSlice";
import distributorReducer from "../redux/slices/distributorSlice";
import corporateReducer from "../redux/slices/corporateSlice"

const store = configureStore({
    devTools: true,
    reducer: {
        stockItemData: stockItemReducer,
        customerData: customerReducer,
        distributorData: distributorReducer,
        corporateData: corporateReducer,
    }
});

export default store;