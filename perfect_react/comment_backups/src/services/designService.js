import api from './httpClient.js';

const handleApiError = (error, defaultMsg = 'Đã có lỗi xảy ra') => {
  if (error.response) {
    console.error("API ERROR:", error.response.status, error.response.data);
    throw new Error(error.response.data?.message || defaultMsg);
  } else if (error.request) {
    throw new Error('Không thể kết nối tới server.');
  } else {
    throw new Error(error.message || defaultMsg);
  }
};

const designService = {
  // ✅ 1. Lấy danh sách thiết kế
  async getMyDesigns(userId) {
    try {
      const resp = await api.get(`/api/custom-products/user/${userId}`);
      return resp.data;
    } catch (err) {
      handleApiError(err, 'Không thể tải danh sách thiết kế');
      return [];
    }
  },

  // ✅ 2. Tạo Custom Product (Dùng 'api' để có Token)
  async createCustomProductWithImage(payloadObject, imageFile, opts = {}) {
    try {
      const form = new FormData();
      
      // Đóng gói JSON payload
      const payloadBlob = new Blob([JSON.stringify(payloadObject)], { type: 'application/json' });
      form.append('payload', payloadBlob);

      // Đóng gói file ảnh
      if (imageFile) {
        form.append('image', imageFile, opts.filename || 'design.png');
      }

      console.debug("📤 Uploading design...");

      // Dùng instance 'api' chính để đảm bảo Authorization Header được gửi kèm
      const resp = await api.post('/api/custom-products', form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: opts.onUploadProgress,
      });

      return resp.data;
    } catch (err) {
      handleApiError(err, 'Tạo sản phẩm tùy chỉnh thất bại');
    }
  },

  // ✅ 3. Upload ảnh riêng lẻ (nếu cần dùng)
  async uploadDesignImage(file, opts = {}) {
    try {
      const form = new FormData();
      form.append('file', file, opts.filename || 'design.png');

      const resp = await api.post('/api/upload/custom', form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: opts.onUploadProgress,
      });
      return resp.data;
    } catch (err) {
      handleApiError(err, 'Upload file thất bại');
    }
  },

// ✅ HÀM XÓA THIẾT KẾ
  async deleteDesign(id) {
    try {
      const resp = await api.delete(`/api/custom-products/${id}`);
      return resp.data;
    } catch (err) {
      // Nếu là lỗi 409 từ backend, ném nguyên object lỗi để Frontend xử lý
      if (err.response && err.response.status === 409) {
          throw err; 
      }
      handleApiError(err, 'Xóa thiết kế thất bại');
    }
  }
};

// Export mặc định object chứa tất cả các hàm
export default designService;

// Export lẻ từng hàm để tương thích nếu code cũ có dùng import { ... }
export const { 
  createCustomProductWithImage, 
  uploadDesignImage, 
  getMyDesigns, 
  deleteDesign 
} = designService;