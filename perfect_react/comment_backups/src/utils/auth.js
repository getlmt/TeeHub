// src/utils/auth.js (ĐÃ SỬA HOÀN CHỈNH)

const ACCESS_KEY = "accessToken";
const ROLE_KEY   = "role";
const EMAIL_KEY  = "email";
const ID_KEY     = "userId"; // <-- 1. Thêm key cho userId

export function getAccessToken() {
  // Dùng localStorage
  const t = localStorage.getItem(ACCESS_KEY); 
  if (!t) return null;
  const s = String(t).trim().toLowerCase();
  if (s === "null" || s === "undefined" || s === "") return null;
  return t;
}

export function setAccessToken(t) {
  // Dùng localStorage
  if (t) localStorage.setItem(ACCESS_KEY, t);
  else localStorage.removeItem(ACCESS_KEY);
}

export function setAuth({ accessToken, role, email, userId }) { 
  setAccessToken(accessToken);
  // Dùng localStorage
  if (role)  localStorage.setItem(ROLE_KEY, role);
  if (email) localStorage.setItem(EMAIL_KEY, email);
  // Lưu userId (chuyển thành chuỗi)
  if (userId !== null && userId !== undefined) localStorage.setItem(ID_KEY, String(userId)); 
  window.dispatchEvent(new Event('authChange'));
}

export function clearAuth() {
  // Dùng localStorage
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(EMAIL_KEY);
  localStorage.removeItem(ID_KEY); // <-- Xóa userId
  window.dispatchEvent(new Event('authChange'));
}

export function getRole() { 
  return localStorage.getItem(ROLE_KEY); 
}

export function getEmail() {
  return localStorage.getItem(EMAIL_KEY) || "";
}

export function getUserId() { 
    const id = localStorage.getItem(ID_KEY);
    // Chuyển lại thành số nguyên (hoặc null nếu không có)
    return id ? parseInt(id, 10) : null; 
}

// ---- helpers cho role (Giữ nguyên) ----
export function normalizeRole(r = "") {
  const up = String(r).trim().toUpperCase();
  if (!up) return "";
  return up.startsWith("ROLE_") ? up : `ROLE_${up}`;
}
export function hasAnyRole(required = []) {
  const current = normalizeRole(getRole() || "");
  const set = required.map(normalizeRole);
  return !!current && set.includes(current);
}

//Cập nhật isAuthenticated để kiểm tra cả userId (tùy chọn nhưng nên làm)
export function isAuthenticated() {
  const t = getAccessToken();
  const id = getUserId();
  // Chỉ coi là đã đăng nhập nếu có cả token VÀ userId
  return !!(t && t.split(".").length === 3 && t.length > 20 && id !== null); 
}
export const getUserRole = () => {
  return localStorage.getItem(ROLE_KEY);// Kiểm tra lại xem bạn lưu key là 'user' hay 'userInfo'
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      return user.role; // Trả về 'ADMIN' hoặc 'USER'
    } catch (e) {
      return null;
    }
  }
  return null;
};