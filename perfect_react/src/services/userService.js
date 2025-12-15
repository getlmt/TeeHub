
import api from './httpClient.js';


const handleApiError = (err, fallback = 'Đã có lỗi xảy ra.') => {
  
  const msg =
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    fallback;
  throw new Error(msg);
};



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
  
  try {
    const res = await api.post('/api/users', payload);
    return res.data;
  } catch (err) {
    handleApiError(err, 'Không thể tạo người dùng.');
  }
};

export const adminUpdateUser = async (id, payload) => {
  
  
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


export const adminChangeRole = async (id, role, admin_password) => {
  try {
    const res = await api.put(`/api/users/${id}/role`, { role, admin_password });
    return res.data;
  } catch (err) {
    handleApiError(err, 'Không thể đổi vai trò người dùng.');
  }
};




const adminUserService = {
  adminFetchUsers,
  adminSearchUsers,
  adminCreateUser,
  adminUpdateUser,
  adminDeleteUser,
  adminChangeRole,
  
};

export default adminUserService;
