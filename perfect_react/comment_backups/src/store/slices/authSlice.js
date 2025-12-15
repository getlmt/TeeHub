// src/store/slices/authSlice.js
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

// --- Helper để trích xuất thông báo lỗi chuẩn xác ---
const extractErrorMessage = (err) => {
  if (err.response && err.response.data) {
    const data = err.response.data;
    // 1. Nếu Backend trả về chuỗi text (vd: "Email đã tồn tại")
    if (typeof data === 'string') return data;
    // 2. Nếu Backend trả về JSON có key 'message'
    if (data.message) return data.message;
    // 3. Nếu Backend trả về JSON có key 'error'
    if (data.error) return data.error;
  }
  return err.message || 'Đã có lỗi xảy ra.';
};

// ================= THUNKS =================

// 1. LOGIN
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

// 2. REGISTER (Đã sửa lỗi hiển thị message)
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

// 3. LOGOUT
export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await apiLogout();
    return null;
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

// 4. GET CURRENT USER (Lấy từ LocalStorage khi reload trang)
export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async () => {
  const email = getEmail();
  const role = getRole();
  const userId = getUserId();
  const token = getAccessToken();

  if (!email || !token || userId === null) throw new Error('No valid session found');

  return { email, role, userId };
});

// 5. FETCH USER INFO (Dùng cho OAuth2 - Gọi API lấy thông tin bằng Token)
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
      
      // Trả về dữ liệu chuẩn hóa
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

// ================= SLICE =================

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
    // Action để set Token thủ công (dùng cho OAuth2 nếu cần)
    setCredentials(state, action) {
        const { accessToken, email, role, userId } = action.payload;
        state.isAuthenticated = true;
        state.user = { email, role, userId };
        setAuth({ accessToken, email, role, userId });
    }
  },
  extraReducers: (builder) => {
    builder
      // === LOGIN ===
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
        state.error = action.payload; // Payload đã được xử lý bởi extractErrorMessage
        state.user = null;
        state.isAuthenticated = false;
        clearAuthStorage();
      })

      // === REGISTER ===
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
        state.error = action.payload; // Payload đã được xử lý bởi extractErrorMessage
        state.user = null;
        state.isAuthenticated = false;
        clearAuthStorage();
      })

      // === LOGOUT ===
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        clearAuthStorage();
      })

      // === GET CURRENT USER ===
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      
      // === FETCH USER INFO (OAuth2) ===
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