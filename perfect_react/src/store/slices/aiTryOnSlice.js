import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { aiService } from '../../services/aiService.js';
import { AI_TRY_ON_STATUS } from '../../utils/constants.js';


export const uploadImage = createAsyncThunk(
  'aiTryOn/uploadImage',
  async (file, { rejectWithValue }) => {
    try {
      const response = await aiService.uploadImage(file);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Image upload failed');
    }
  }
);

export const processTryOn = createAsyncThunk(
  'aiTryOn/processTryOn',
  async ({ userImage, productImage, productId }, { rejectWithValue }) => {
    try {
      const response = await aiService.processTryOn({
        userImage,
        productImage,
        productId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Try-on processing failed');
    }
  }
);

export const generateVariations = createAsyncThunk(
  'aiTryOn/generateVariations',
  async ({ baseImage, variations }, { rejectWithValue }) => {
    try {
      const response = await aiService.generateVariations({
        baseImage,
        variations,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Variation generation failed');
    }
  }
);

const initialState = {
  userImage: null,
  productImage: null,
  resultImage: null,
  variations: [],
  status: AI_TRY_ON_STATUS.IDLE,
  progress: 0,
  error: null,
  history: [],
  settings: {
    quality: 'high',
    style: 'realistic',
    background: 'original',
  },
};

const aiTryOnSlice = createSlice({
  name: 'aiTryOn',
  initialState,
  reducers: {
    setUserImage: (state, action) => {
      state.userImage = action.payload;
      state.status = AI_TRY_ON_STATUS.IDLE;
      state.error = null;
    },
    setProductImage: (state, action) => {
      state.productImage = action.payload;
      state.status = AI_TRY_ON_STATUS.IDLE;
      state.error = null;
    },
    setSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    clearResult: (state) => {
      state.resultImage = null;
      state.variations = [];
      state.status = AI_TRY_ON_STATUS.IDLE;
      state.progress = 0;
      state.error = null;
    },
    clearAll: (state) => {
      state.userImage = null;
      state.productImage = null;
      state.resultImage = null;
      state.variations = [];
      state.status = AI_TRY_ON_STATUS.IDLE;
      state.progress = 0;
      state.error = null;
    },
    addToHistory: (state, action) => {
      state.history.unshift({
        id: Date.now(),
        userImage: state.userImage,
        productImage: state.productImage,
        resultImage: state.resultImage,
        timestamp: new Date().toISOString(),
        settings: state.settings,
      });
      
      if (state.history.length > 10) {
        state.history = state.history.slice(0, 10);
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(uploadImage.pending, (state) => {
        state.status = AI_TRY_ON_STATUS.UPLOADING;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.status = AI_TRY_ON_STATUS.IDLE;
        state.userImage = action.payload.imageUrl;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.status = AI_TRY_ON_STATUS.ERROR;
        state.error = action.payload;
      })
      
      
      .addCase(processTryOn.pending, (state) => {
        state.status = AI_TRY_ON_STATUS.PROCESSING;
        state.progress = 0;
        state.error = null;
      })
      .addCase(processTryOn.fulfilled, (state, action) => {
        state.status = AI_TRY_ON_STATUS.COMPLETED;
        state.progress = 100;
        state.resultImage = action.payload.resultImage;
        state.variations = action.payload.variations || [];
      })
      .addCase(processTryOn.rejected, (state, action) => {
        state.status = AI_TRY_ON_STATUS.ERROR;
        state.error = action.payload;
        state.progress = 0;
      })
      
      
      .addCase(generateVariations.pending, (state) => {
        state.status = AI_TRY_ON_STATUS.PROCESSING;
        state.error = null;
      })
      .addCase(generateVariations.fulfilled, (state, action) => {
        state.status = AI_TRY_ON_STATUS.COMPLETED;
        state.variations = action.payload.variations;
      })
      .addCase(generateVariations.rejected, (state, action) => {
        state.status = AI_TRY_ON_STATUS.ERROR;
        state.error = action.payload;
      });
  },
});

export const {
  setUserImage,
  setProductImage,
  setSettings,
  setProgress,
  clearResult,
  clearAll,
  addToHistory,
  clearError,
} = aiTryOnSlice.actions;

export default aiTryOnSlice.reducer;
