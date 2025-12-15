import api from './api';
export const reviewService = {
    /**
     * Lấy tất cả review của 1 sản phẩm
     */
    getReviews: async (productId) => {
        try {
            const response = await api.get(`/api/products/${productId}/reviews`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching reviews for product ${productId}:`, error);
            throw error;
        }
    },

    /**
     * Lấy thông số (AVG, Count)
     */
    getRatingStats: async (productId) => {
        try {
            const response = await api.get(`/api/products/${productId}/rating-stats`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching rating stats for product ${productId}:`, error);
            throw error;
        }
    },

    /**
     * Post 1 review mới
     */
    postReview: async (reviewData) => {
        // reviewData = { productItemId, ratingValue, comment, userName }
        try {
            const response = await api.post('/api/reviews', reviewData);
            return response.data;
        } catch (error) {
            console.error('Error posting review:', error);
            throw error;
        }
    },
    getFeaturedReviews: async (limit = 3) => {
        try {
            // Gọi API mới mà bạn vừa tạo
            const response = await api.get(`/api/reviews/featured?limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching featured reviews:', error);
            throw error;
        }
    }

};