import { createSlice } from "@reduxjs/toolkit";
import {
  getSavingsGoal,
  saveSavingsGoal,
  getMonthlyTargetRate,
  saveMonthlyTargetRate,
  getCategoryBudgets,
  saveCategoryBudgets,
  getCategorySpent,
  saveCategorySpent,
} from "../utils/storage.js";

// budgetSlice manages savings targets and category spending budgets using Redux Toolkit.
const initialState = {
  savingsGoal: getSavingsGoal(),
  monthlyTargetRate: getMonthlyTargetRate(),
  categoryBudgets: getCategoryBudgets(),
  categorySpent: getCategorySpent(),
};

export const budgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {
    updateSavingsGoal: (state, action) => {
      const amount = Number(action.payload);
      state.savingsGoal = amount;
      saveSavingsGoal(amount);
    },
    updateMonthlyTargetRate: (state, action) => {
      const rate = Number(action.payload);
      state.monthlyTargetRate = rate;
      saveMonthlyTargetRate(rate);
    },
    setCategoryBudget: (state, action) => {
      const { category, amount, spent } = action.payload;
      state.categoryBudgets[category] = Number(amount);
      saveCategoryBudgets(state.categoryBudgets);

      if (spent !== undefined && spent !== null && !isNaN(Number(spent))) {
        state.categorySpent[category] = Math.max(0, Number(spent));
        saveCategorySpent(state.categorySpent);
      }
    },
    updateCategorySpent: (state, action) => {
      const { category, amount } = action.payload;
      state.categorySpent[category] = Math.max(0, Number(amount) || 0);
      saveCategorySpent(state.categorySpent);
    },
    deleteCategoryBudget: (state, action) => {
      const category = action.payload;
      delete state.categoryBudgets[category];
      delete state.categorySpent[category];
      saveCategoryBudgets(state.categoryBudgets);
      saveCategorySpent(state.categorySpent);
    },
  },
});

export const {
  updateSavingsGoal,
  updateMonthlyTargetRate,
  setCategoryBudget,
  updateCategorySpent,
  deleteCategoryBudget,
} = budgetSlice.actions;

export const selectSavingsGoal = (state) => state.budget.savingsGoal;
export const selectMonthlyTargetRate = (state) => state.budget.monthlyTargetRate;
export const selectCategoryBudgets = (state) => state.budget.categoryBudgets;
export const selectCategorySpent = (state) => state.budget.categorySpent;

export default budgetSlice.reducer;
