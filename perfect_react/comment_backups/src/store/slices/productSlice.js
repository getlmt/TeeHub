import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '../../services/productService';

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (query, { rejectWithValue }) => {
    try {
      const response = await productService.searchProducts(query);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Search failed');
    }
  }
);

const initialState = {
  products: [],
  currentProduct: null,
  searchResults: [],
  categories: [],
  filters: {
    category: '',
    priceRange: [0, 1000],
    size: '',
    color: '',
    sortBy: 'name',
    sortOrder: 'asc',
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  },
  isLoading: false,
  isSearching: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        priceRange: [0, 1000],
        size: '',
        color: '',
        sortBy: 'name',
        sortOrder: 'asc',
      };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products || action.payload;
        state.pagination = action.payload.pagination || state.pagination;
        state.categories = action.payload.categories || state.categories;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Search products
      .addCase(searchProducts.pending, (state) => {
        state.isSearching = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isSearching = false;
        state.searchResults = action.payload.products || action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isSearching = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setPagination,
  clearSearchResults,
  clearError,
} = productSlice.actions;

export default productSlice.reducer;
