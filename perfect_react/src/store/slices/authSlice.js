
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  login as apiLogin, 
  logout as apiLogout,
  register as apiRegister 
} from '../../services/authService.js';
import {
  setAuth,
  clearAuth as clearAuthStorage,
  getAccessToken,
  getEmail,
  getRole,
  getUserId
} from '../../utils/auth.js';
import { API_BASE_URL } from '../../utils/constants.js';


const extractErrorMessage = (err) => {
  if (err.response && err.response.data) {
    const data = err.response.data;
    
    if (typeof data === 'string') return data;
    
    if (data.message) return data.message;
    
    if (data.error) return data.error;
  }
  return err.message || 'Đã có lỗi xảy ra.';
};




export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const loginResponse = await apiLogin(email, password);
      if (!loginResponse?.accessToken || !loginResponse?.userId) {
        throw new Error("Thông tin đăng nhập trả về không đầy đủ.");
      }
      return loginResponse; 
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);


export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const registerResponse = await apiRegister(userData); 
      if (!registerResponse?.accessToken || !registerResponse?.userId) {
        throw new Error("Thông tin đăng ký trả về không đầy đủ.");
      }
      return registerResponse; 
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);


export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await apiLogout();
    return null;
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});


export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async () => {
  const email = getEmail();
  const role = getRole();
  const userId = getUserId();
  const token = getAccessToken();

  if (!email || !token || userId === null) throw new Error('No valid session found');

  return { email, role, userId };
});


export const fetchUserInfo = createAsyncThunk(
  'auth/fetchUserInfo',
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch user info');
      const data = await response.json();
      
      
      return {
        email: data.emailAddress,
        role: data.role,
        userId: data.id,
        accessToken: token
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);



const initialState = {
  user:
    getAccessToken() && getUserId() !== null
      ? { email: getEmail(), role: getRole(), userId: getUserId() }
      : null,
  isAuthenticated: !!getAccessToken(),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearAuth(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      clearAuthStorage();
    },
    
    setCredentials(state, action) {
        const { accessToken, email, role, userId } = action.payload;
        state.isAuthenticated = true;
        state.user = { email, role, userId };
        setAuth({ accessToken, email, role, userId });
    }
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const { accessToken, email, role, userId } = action.payload;
        setAuth({ accessToken, email, role, userId });
        state.user = { email, role, userId };
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; 
        state.user = null;
        state.isAuthenticated = false;
        clearAuthStorage();
      })

      
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const { accessToken, email, role, userId } = action.payload;
        setAuth({ accessToken, email, role, userId });
        state.user = { email, role, userId };
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; 
        state.user = null;
        state.isAuthenticated = false;
        clearAuthStorage();
      })

      
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        clearAuthStorage();
      })

      
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      
      
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        const { accessToken, email, role, userId } = action.payload;
        setAuth({ accessToken, email, role, userId });
        state.user = { email, role, userId };
        state.isAuthenticated = true;
      });
  },
});

export const { clearError, clearAuth, setCredentials } = authSlice.actions;
export default authSlice.reducer;