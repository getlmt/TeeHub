
import api from './api';



export const productService = {
  getAllProducts: async (page = 0, size = 10, categoryId = null, searchTerm = null, sort = 'newest', options = {}) => {
    try {
      
      let sortParam = 'createdAt,desc';
      if (sort === 'hot') sortParam = 'hot';
      else if (sort === 'oldest') sortParam = 'createdAt,asc';
      

      const params = {
        page,
        size,
        sort: sortParam
      };

      if (categoryId && categoryId !== 'all') params.categoryId = categoryId;
      if (searchTerm && typeof searchTerm === 'string' && searchTerm.trim() !== '') params.searchTerm = searchTerm.trim();

      
      
      if (options.includeSales) {
        params.includeSales = true;
      }

      const response = await api.get('/api/products', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching all products:', error);
      throw error;
    }
  },

  getProductById: async (productId) => {
    try {
      const response = await api.get(`/api/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with id ${productId}:`, error);
      throw error;
    }
  },

  createProduct: async (productData) => {
    try {
      if (typeof FormData !== 'undefined' && productData instanceof FormData) {
        const response = await api.post('/api/products', productData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
      }

      const response = await api.post('/api/products', productData, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  updateProduct: async (productId, productData) => {
    try {
      if (typeof FormData !== 'undefined' && productData instanceof FormData) {
        const response = await api.put(`/api/products/${productId}`, productData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
      }
      
      throw new Error('updateProduct expects FormData for now');
    } catch (error) {
      console.error(`Error updating product ${productId}:`, error);
      throw error;
    }
  },

  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/api/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product with id ${productId}:`, error);
      throw error;
    }
  },

  
  getSalesCounts: async (productIds = []) => {
    try {
      if (!Array.isArray(productIds) || productIds.length === 0) return [];

      
      const idsParam = productIds.join(',');
      const response = await api.get('/api/products/sales', { params: { ids: idsParam } });

      
      return response.data;
    } catch (error) {
      console.warn('getSalesCounts failed:', error);
      
      
      return [];
    }
  }
};

export default productService;
