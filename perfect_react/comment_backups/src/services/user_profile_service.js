import api from './httpClient.js';
import axiosRetry from 'axios-retry';

axiosRetry(api, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 1000,
  retryCondition: (error) => {
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      error.response?.status === 429
    );
  },
});

const handleApiError = (error, defaultMsg) => {
  if (error.response) {
    throw new Error(error.response.data?.message || defaultMsg);
  } else if (error.request) {
    throw new Error('Không thể kết nối đến server.');
  } else {
    throw new Error(error.message || defaultMsg);
  }
};

// THÊM HÀM MỚI NÀY VÀO file user_profile_service.js

export const getMyProfile = async () => {
  try {
    // Không cần ID, backend sẽ tự biết bạn là ai qua JWT Token
    const response = await api.get(`/api/users/me`); 
    const data = response.data;
    
    // Tái sử dụng logic chuẩn hóa dữ liệu của bạn
    return {
      userId: data.userId ?? data.id ?? data.user_id ?? null,
      fullName: data.fullName ?? data.full_name ?? data.name ?? '',
      emailAddress: data.emailAddress ?? data.email_address ?? data.email ?? '',
      phoneNumber: data.phoneNumber ?? data.phone_number ?? data.phone ?? '',
      userAvatar: data.userAvatar ?? data.user_avatar ?? data.avatar ?? '',
      __raw: data,
    };
  } catch (err) {
    handleApiError(err, 'Không thể tải thông tin cá nhân.');
  }
};

export const updateUser = async (userId, userData) => {
  if (!userId) throw new Error('ID người dùng là bắt buộc.');
  if (!userData?.fullName) throw new Error('Họ và tên là bắt buộc.');
  if (!userData?.emailAddress || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.emailAddress)) {
    throw new Error('Email không hợp lệ.');
  }
  try {
    const payload = {
      full_name: userData.fullName,
      user_avatar: userData.userAvatar,
      email_address: userData.emailAddress,
      phone_number: userData.phoneNumber,
    };
    const response = await api.put(`/api/users/${userId}`, payload);
    return response.data;
  } catch (err) {
    handleApiError(err, 'Không thể cập nhật người dùng.');
  }
};

export const uploadAvatar = async (file) => {
  try {
    const formData = new FormData();
    formData.append('avatarFile', file);
    const response = await api.post('/api/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data?.avatarUrl ?? response.data;
  } catch (err) {
    handleApiError(err, 'Không thể tải lên ảnh.');
  }
};

// ----- Address -----
const normalizeAddress = (a) => {
  if (!a) return null;
  return {
    addressId: a.addressId ?? a.id ?? a.address_id ?? null,
    unitNumber: a.unitNumber ?? a.unit_number ?? '',
    streetNumber: a.streetNumber ?? a.street_number ?? '',
    addressLine: a.addressLine ?? a.address_line ?? '',
    isDefault: Boolean(a.isDefault ?? a.is_default ?? false),
    __raw: a,
  };
};

// ... (đặt sau hàm deleteAddressForUser) ...

// THÊM HÀM MỚI NÀY ĐỂ SỬA LỖI 403
export const getMyAddresses = async () => {
  try {
    // Gọi endpoint mới, không cần ID
    // Backend sẽ tự biết bạn là ai qua JWT Token
    const response = await api.get(`/api/users/me/addresses`); 
    
    const data = response.data;
    if (!Array.isArray(data)) return [];

    // Tái sử dụng hàm chuẩn hóa của bạn
    return data.map(normalizeAddress); 
  } catch (err) {
    if (err.response?.status === 404) return [];
    handleApiError(err, 'Không thể tải địa chỉ.');
  }
};

export const getAddressesByUserId = async (userId) => {
  if (!userId) throw new Error('User ID is required for addresses.');
  try {
    const response = await api.get(`/api/users/${userId}/addresses`);
    const data = response.data;
    if (!Array.isArray(data)) return [];
    return data.map(normalizeAddress);
  } catch (err) {
    if (err.response?.status === 404) return [];
    handleApiError(err, 'Không thể tải địa chỉ.');
  }
};

export const changeMyPassword = async (oldPassword, newPassword) => {
  if (!oldPassword || !newPassword) throw new Error("Cần mật khẩu cũ và mới");
  try {
    const payload = {
      password: oldPassword, // Tên trường phải khớp backend DTO
      new_password: newPassword, // Tên trường phải khớp backend DTO
    };
    const response = await api.put(`/api/users/me/password`, payload); // Gọi endpoint mới
    return response.data;
  } catch (error) {
     // Xử lý lỗi (giống hàm cũ)
     // ... (copy phần xử lý lỗi từ hàm changeUserPassword cũ)
     handleApiError(error, "Lỗi khi đổi mật khẩu"); // Hoặc dùng handleApiError
  }
};

export const updateMyProfile = async (userData) => {
  // Validate data nếu cần
  if (!userData?.fullName) throw new Error('Họ và tên là bắt buộc.');
  if (!userData?.emailAddress || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.emailAddress)) {
      throw new Error('Email không hợp lệ.');
  }
  try {
    // Chuẩn hóa payload (đảm bảo tên trường khớp backend DTO, ví dụ: snake_case)
    const payload = {
      full_name: userData.fullName,
      user_avatar: userData.userAvatar,
      email_address: userData.emailAddress,
      phone_number: userData.phoneNumber,
    };
    const response = await api.put(`/api/users/me`, payload); // Gọi endpoint mới
    return response.data;
  } catch (err) {
    handleApiError(err, 'Không thể cập nhật thông tin.');
  }
};

export const createMyAddress = async (addressData) => {
  
  const requestData = {
    unit_number: addressData.unitNumber ?? '',
    street_number: addressData.streetNumber ?? '',
    address_line: addressData.addressLine ?? '',
    is_default: addressData.isDefault ?? false,
  };

  try {
    const response = await api.post(`/api/users/me/addresses`, requestData); 
    return normalizeAddress(response.data); // Tái sử dụng hàm chuẩn hóa
  } catch (err) {
    handleApiError(err, 'Không thể tạo địa chỉ.');
  }
};

export const updateMyAddress = async (addressId, addressData) => {
  if (!addressId) throw new Error('Address ID is required.');
  
  const requestData = {
    unit_number: addressData.unitNumber ?? '',    // (Thêm nếu cần)
    street_number: addressData.streetNumber ?? '', // <-- Quan trọng
    address_line: addressData.addressLine ?? '',   // <-- Quan trọng
    is_default: addressData.isDefault ?? false   // (Thêm nếu cần)
  };
 

  try {
    const response = await api.put(`/api/users/me/addresses/${addressId}`, requestData); // <-- Gửi requestData
    return normalizeAddress(response.data); 
  } catch (err) {
    handleApiError(err, 'Không thể cập nhật địa chỉ.');
  }
};

export const deleteMyAddress = async (addressId) => {
  if (!addressId) throw new Error('Address ID is required.');
  try {
    const response = await api.delete(`/api/users/me/addresses/${addressId}`);
    return response.status === 204 ? null : response.data;
  } catch (err) {
    handleApiError(err, 'Không thể xóa địa chỉ.');
  }
};



