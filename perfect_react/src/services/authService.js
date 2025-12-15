
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


export async function register(userData) {
  
  console.debug("Calling API POST /auth/register");

  
  
  const res = await api.post("/auth/register", userData);

  if (!res || !res.data) {
    console.error("Register API call failed or returned no data.");
    throw new Error("Không nhận được phản hồi từ máy chủ đăng ký.");
  }
  console.debug("Register API response data:", res.data);

  
  const { accessToken, email: me, role, userId } = res.data;

  if (!accessToken || userId === undefined || userId === null) {
    console.error("Register response is missing accessToken or userId:", res.data);
    throw new Error("Thông tin đăng ký trả về không đầy đủ (thiếu token hoặc ID người dùng).");
  }

  
  setAuth({ accessToken, email: me, role, userId });
  console.debug("Auth info (from register) saved to storage.");
  
  
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


export const authService = {
  login,
  register, 
  logout,
};
