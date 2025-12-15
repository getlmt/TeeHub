// service/categoryService.js
import api from './api';

export const categoryService = {
    getAllCategories: async (page = 0, size = 10, search = '') => {
        try {
            const params = { page, size };
            if (search) {
                params.search = search;
            }
            const response = await api.get('/api/categories', { params });
            return response.data; // { content, totalPages, totalElements, ... }
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    getCategoryById: async (categoryId) => {
        try {
            const response = await api.get(`/api/categories/${categoryId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching category:', error);
            throw error;
        }
    },

    createCategory: async (categoryData) => {
        try {
            const response = await api.post('/api/categories', categoryData);
            return response.data;
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    },

    updateCategory: async (categoryId, categoryData) => {
        try {
            const response = await api.put(`/api/categories/${categoryId}`, categoryData);
            return response.data;
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    },

    deleteCategory: async (categoryId) => {
        try {
            const response = await api.delete(`/api/categories/${categoryId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    }
};