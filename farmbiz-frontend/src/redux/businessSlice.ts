import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { businessService } from '../services/businessService';
import { Business, BusinessFormData } from '../types';

interface BusinessState {
  businesses: Business[];
  currentBusiness: Business | null;
  loading: boolean;
  error: string | null;
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
  };
}

const initialState: BusinessState = {
  businesses: [],
  currentBusiness: null,
  loading: false,
  error: null,
  pagination: {
    count: 0,
    next: null,
    previous: null,
  },
};

// Async thunks
export const fetchBusinesses = createAsyncThunk(
  'businesses/fetchBusinesses',
  async (params: {
    q?: string;
    category?: string;
    page?: number;
  } = {}, { rejectWithValue }) => {
    try {
      const response = await businessService.getBusinesses(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch businesses'
      );
    }
  }
);

export const fetchBusiness = createAsyncThunk(
  'businesses/fetchBusiness',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await businessService.getBusiness(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch business'
      );
    }
  }
);

export const createBusiness = createAsyncThunk(
  'businesses/createBusiness',
  async (businessData: BusinessFormData, { rejectWithValue }) => {
    try {
      const response = await businessService.createBusiness(businessData);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.errors || { message: 'Failed to create business' }
      );
    }
  }
);

export const updateBusiness = createAsyncThunk(
  'businesses/updateBusiness',
  async ({ id, data }: { id: number; data: Partial<BusinessFormData> }, { rejectWithValue }) => {
    try {
      const response = await businessService.updateBusiness(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.errors || { message: 'Failed to update business' }
      );
    }
  }
);

export const deleteBusiness = createAsyncThunk(
  'businesses/deleteBusiness',
  async (id: number, { rejectWithValue }) => {
    try {
      await businessService.deleteBusiness(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete business'
      );
    }
  }
);

const businessSlice = createSlice({
  name: 'businesses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentBusiness: (state, action: PayloadAction<Business | null>) => {
      state.currentBusiness = action.payload;
    },
    clearBusinesses: (state) => {
      state.businesses = [];
      state.pagination = {
        count: 0,
        next: null,
        previous: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch businesses
      .addCase(fetchBusinesses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinesses.fulfilled, (state, action) => {
        state.loading = false;
        const { results, count, next, previous } = action.payload;
        
        // If this is page 1, replace the array; otherwise, append for pagination
        if (action.meta.arg?.page === 1 || !action.meta.arg?.page) {
          state.businesses = results;
        } else {
          state.businesses = [...state.businesses, ...results];
        }
        
        state.pagination = { count, next, previous };
      })
      .addCase(fetchBusinesses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch single business
      .addCase(fetchBusiness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusiness.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBusiness = action.payload;
      })
      .addCase(fetchBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create business
      .addCase(createBusiness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBusiness.fulfilled, (state, action) => {
        state.loading = false;
        state.businesses.unshift(action.payload);
      })
      .addCase(createBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update business
      .addCase(updateBusiness.fulfilled, (state, action) => {
        const index = state.businesses.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.businesses[index] = action.payload;
        }
        if (state.currentBusiness?.id === action.payload.id) {
          state.currentBusiness = action.payload;
        }
      })
      // Delete business
      .addCase(deleteBusiness.fulfilled, (state, action) => {
        state.businesses = state.businesses.filter(b => b.id !== action.payload);
        if (state.currentBusiness?.id === action.payload) {
          state.currentBusiness = null;
        }
      });
  },
});

export const { clearError, setCurrentBusiness, clearBusinesses } = businessSlice.actions;
export default businessSlice.reducer;
