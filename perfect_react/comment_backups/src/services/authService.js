// src/services/authService.js 
import api from './httpClient.js';
import { setAuth, clearAuth } from '../utils/auth.js';

export async function login(email, password) {
  console.debug("Calling API POST /auth/login with email:", email);
  const res = await api.post("/auth/login", { email, password });

  if (!res || !res.data) {
    console.error("Login API call failed or returned no data.");
    throw new Error("Không nhận được phản hồi từ máy chủ đăng nhập.");
  }
  console.debug("Login API response data:", res.data);

  const { accessToken, email: me, role, userId } = res.data;

  if (!accessToken || userId === undefined || userId === null) {
    console.error("Login response is missing accessToken or userId:", res.data);
    throw new Error("Thông tin đăng nhập trả về không đầy đủ (thiếu token hoặc ID người dùng).");
  }
  setAuth({ accessToken, email: me, role, userId });
  console.debug("Auth info (including userId) saved to storage.");
  return { accessToken, email: me, role, userId };
}

// [MỚI] BỔ SUNG HÀM REGISTER CÒN THIẾU
export async function register(userData) {
  // userData đến từ thunk, vd: { fullName, email, password }
  console.debug("Calling API POST /auth/register");

  // 1. Gọi API đăng ký
  // !!! Đảm bảo endpoint '/auth/register' là chính xác
  const res = await api.post("/auth/register", userData);

  if (!res || !res.data) {
    console.error("Register API call failed or returned no data.");
    throw new Error("Không nhận được phản hồi từ máy chủ đăng ký.");
  }
  console.debug("Register API response data:", res.data);

  // 2. Xử lý response - Giả định API trả về auth info để auto-login
  const { accessToken, email: me, role, userId } = res.data;

  if (!accessToken || userId === undefined || userId === null) {
    console.error("Register response is missing accessToken or userId:", res.data);
    throw new Error("Thông tin đăng ký trả về không đầy đủ (thiếu token hoặc ID người dùng).");
  }

  // 3. Tự động đăng nhập bằng cách lưu auth info
  setAuth({ accessToken, email: me, role, userId });
  console.debug("Auth info (from register) saved to storage.");
  
  // 4. Trả về auth info cho authSlice thunk
  return { accessToken, email: me, role, userId };
}


export async function logout({ redirect = true } = {}) {
  try {
    console.debug("Calling API POST /auth/logout");
    await api.post("/auth/logout");
    console.debug("Logout API call successful.");
  } catch (err) {
    console.warn("Logout API call failed (ignoring error):", err?.message);
  } finally {
    console.debug("Clearing auth info from storage.");
    clearAuth();
    if (redirect) {
      console.debug("Redirecting to /login");
      window.location.replace("/login");
    }
  }
}

// Cập nhật cả object export (nếu bạn dùng nó ở đâu đó)
export const authService = {
  login,
  register, // <-- [MỚI] Thêm vào đây
  logout,
};
