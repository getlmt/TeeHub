// src/services/adminUserService.js
import api from './httpClient.js';

/* =========================================================
   Helpers
========================================================= */
const handleApiError = (err, fallback = 'Đã có lỗi xảy ra.') => {
  // Ưu tiên message từ server (nếu có)
  const msg =
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    fallback;
  throw new Error(msg);
};

/* =========================================================
   ADMIN: Users CRUD (khớp DTO/Controller hiện tại)
   - DTO trả về: { id, full_name, user_avatar, email_address, phone_number, role }
   - Request tạo/sửa: SiteUserRequest (snake_case)
========================================================= */

export const adminFetchUsers = async () => {
  try {
    const res = await api.get('/api/users');
    return res.data ?? [];
  } catch (err) {
    handleApiError(err, 'Không thể tải danh sách người dùng.');
  }
};

export const adminSearchUsers = async (kw) => {
  try {
    if (!kw || !kw.trim()) return adminFetchUsers();
    const res = await api.get('/api/users/search', { params: { kw } });
    return res.data ?? [];
  } catch (err) {
    handleApiError(err, 'Không thể tìm kiếm người dùng.');
  }
};

export const adminCreateUser = async (payload) => {
  // payload theo SiteUserRequest: full_name, email_address, phone_number?, password, role?
  try {
    const res = await api.post('/api/users', payload);
    return res.data;
  } catch (err) {
    handleApiError(err, 'Không thể tạo người dùng.');
  }
};

export const adminUpdateUser = async (id, payload) => {
  // payload: { full_name?, user_avatar?, email_address?, phone_number?, role? }
  // (Bạn có thể thêm enabled/status nếu BE hỗ trợ)
  try {
    const res = await api.put(`/api/users/${id}`, payload);
    return res.data;
  } catch (err) {
    handleApiError(err, 'Không thể cập nhật người dùng.');
  }
};

export const adminDeleteUser = async (id) => {
  try {
    await api.delete(`/api/users/${id}`);
  } catch (err) {
    handleApiError(err, 'Không thể xóa người dùng.');
  }
};

/* =========================================================
   Đổi vai trò (yêu cầu xác thực lại mật khẩu admin)
   BE: PUT /api/users/{id}/role
   Body: { role: 'ADMIN'|'USER'|'MODERATOR', admin_password: '...' }
========================================================= */
export const adminChangeRole = async (id, role, admin_password) => {
  try {
    const res = await api.put(`/api/users/${id}/role`, { role, admin_password });
    return res.data;
  } catch (err) {
    handleApiError(err, 'Không thể đổi vai trò người dùng.');
  }
};

/* (tuỳ chọn) Đổi mật khẩu người dùng theo id (nếu dùng endpoint riêng)
export const adminResetUserPassword = async (id, new_password) => {
  try {
    const res = await api.put(`/api/users/${id}`, { new_password });
    return res.data;
  } catch (err) {
    handleApiError(err, 'Không thể đặt lại mật khẩu.');
  }
};
*/

// (tuỳ chọn) export gộp
const adminUserService = {
  adminFetchUsers,
  adminSearchUsers,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
  adminChangeRole,
  // adminResetUserPassword,
};

export default adminUserService;
