

import api from './httpClient'; 

export const promotionService = {
    
    getPromotionByProductId: async (productId) => {
        try {
            const response = await api.get(`/api/promotions/product/${productId}`);
            return response.data;
        } catch (error) {
            
            throw error;
        }
    },

    
    createPromotion: async (promotionData) => {
        try {
            const response = await api.post('/api/promotions', promotionData);
            return response.data;
        } catch (error) {
            console.error('Error creating promotion:', error);
            throw error;
        }
    },

    
    updatePromotion: async (promotionId, promotionData) => {
        try {
            const response = await api.put(`/api/promotions/${promotionId}`, promotionData);
            return response.data;
        } catch (error) {
            console.error(`Error updating promotion ${promotionId}:`, error);
            throw error;
        }
    },

    
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