import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import employeeService from '../../services/employeeService';

export const fetchEmployees = createAsyncThunk('employees/fetchAll', async (params, thunkAPI) => {
  try {
    return await employeeService.getAll(params);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const createEmployee = createAsyncThunk('employees/create', async (data, thunkAPI) => {
  try {
    return await employeeService.create(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateEmployee = createAsyncThunk('employees/update', async ({ id, data }, thunkAPI) => {
  try {
    return await employeeService.update(id, data);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deleteEmployee = createAsyncThunk('employees/delete', async (id, thunkAPI) => {
  try {
    await employeeService.remove(id);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    data: [],
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.content || [];
        state.totalElements = action.payload.totalElements || 0;
        state.totalPages = action.payload.totalPages || 0;
        state.currentPage = action.payload.number || 0;
      })
      .addCase(fetchEmployees.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.data = [action.payload, ...state.data];
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.data.findIndex(e => e.id === action.payload.id);
        if (index !== -1) state.data[index] = action.payload;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.data = state.data.filter(e => e.id !== action.payload);
      });
  },
});

export default employeeSlice.reducer;
