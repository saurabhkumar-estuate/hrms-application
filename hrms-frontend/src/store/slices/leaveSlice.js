import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import leaveService from '../../services/leaveService';

export const fetchLeaves = createAsyncThunk('leaves/fetchAll', async (params, thunkAPI) => {
  try {
    return await leaveService.getAll(params);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const applyLeave = createAsyncThunk('leaves/apply', async (data, thunkAPI) => {
  try {
    return await leaveService.apply(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const approveLeave = createAsyncThunk('leaves/approve', async (id, thunkAPI) => {
  try {
    return await leaveService.approve(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const rejectLeave = createAsyncThunk('leaves/reject', async (id, thunkAPI) => {
  try {
    return await leaveService.reject(id);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const leaveSlice = createSlice({
  name: 'leaves',
  initialState: {
    data: [],
    balance: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaves.pending, (state) => { state.isLoading = true; })
      .addCase(fetchLeaves.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchLeaves.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(applyLeave.fulfilled, (state, action) => {
        state.data = [action.payload, ...state.data];
      })
      .addCase(approveLeave.fulfilled, (state, action) => {
        const index = state.data.findIndex(l => l.id === action.payload.id);
        if (index !== -1) state.data[index] = action.payload;
      })
      .addCase(rejectLeave.fulfilled, (state, action) => {
        const index = state.data.findIndex(l => l.id === action.payload.id);
        if (index !== -1) state.data[index] = action.payload;
      });
  },
});

export default leaveSlice.reducer;
