import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import employeeReducer from './slices/employeeSlice';
import leaveReducer from './slices/leaveSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
    leaves: leaveReducer,
  },
});
