// 👇 LƯU Ý: Kiểm tra xem file cấu hình axios của bạn tên là 'httpClient' hay 'api'
// Nếu file đó tên là 'api.js' thì sửa dòng dưới thành: import api from './api';
import api from './httpClient'; 

export const promotionService = {
    /**
     * 🟢 Lấy KM theo Product ID (Thay thế cho hàm lấy theo Category cũ)
     * Endpoint: GET /api/promotions/product/{productId}
     */
    getPromotionByProductId: async (productId) => {
        try {
            const response = await api.get(`/api/promotions/product/${productId}`);
            return response.data;
        } catch (error) {
            // Ném lỗi ra để component Products.jsx bắt được (ví dụ lỗi 404 - chưa có KM)
            throw error;
        }
    },

    /**
     * Tạo KM mới
     * Payload: { name, description, discountRate, startDate, endDate, productId }
     */
    createPromotion: async (promotionData) => {
        try {
            const response = await api.post('/api/promotions', promotionData);
            return response.data;
        } catch (error) {
            console.error('Error creating promotion:', error);
            throw error;
        }
    },

    /**
     * Cập nhật KM
     */
    updatePromotion: async (promotionId, promotionData) => {
        try {
            const response = await api.put(`/api/promotions/${promotionId}`, promotionData);
            return response.data;
        } catch (error) {
            console.error(`Error updating promotion ${promotionId}:`, error);
            throw error;
        }
    },

    /**
     * Xóa KM
     */
    deletePromotion: async (promotionId) => {
        try {
            const response = await api.delete(`/api/promotions/${promotionId}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting promotion ${promotionId}:`, error);
            throw error;
        }
    }
};