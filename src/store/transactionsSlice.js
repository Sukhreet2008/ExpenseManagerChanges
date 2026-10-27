import { createSlice } from "@reduxjs/toolkit";
import { getTransactions, saveTransactions } from "../utils/storage.js";

// transactionsSlice manages all transaction CRUD actions using Redux Toolkit.
// Demonstrates modern Redux: slices, immer-powered reducers, action creators, and selectors.
const initialState = {
  items: getTransactions(),
};

export const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    addTransaction: (state, action) => {
      const newTransaction = {
        id: Date.now(),
        ...action.payload,
      };
      state.items.unshift(newTransaction);
      saveTransactions(state.items);
    },
    updateTransaction: (state, action) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
        saveTransactions(state.items);
      }
    },
    deleteTransaction: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
      saveTransactions(state.items);
    },
    clearAllTransactions: (state) => {
      state.items = [];
      saveTransactions([]);
    },
    importTransactions: (state, action) => {
      state.items = action.payload;
      saveTransactions(state.items);
    },
  },
});

export const {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  clearAllTransactions,
  importTransactions,
} = transactionsSlice.actions;

// Selectors
export const selectAllTransactions = (state) => state.transactions.items;

export const selectTotalIncome = (state) =>
  state.transactions.items
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

export const selectTotalExpense = (state) =>
  state.transactions.items
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

export const selectBalance = (state) => {
  const income = selectTotalIncome(state);
  const expense = selectTotalExpense(state);
  return income - expense;
};

export default transactionsSlice.reducer;

