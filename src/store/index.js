import { configureStore } from "@reduxjs/toolkit";
import transactionsReducer from "./transactionsSlice.js";
import budgetReducer from "./budgetSlice.js";

// configureStore integrates all slices and automatically enables Redux DevTools
export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    budget: budgetReducer,
  },
});

export default store;

