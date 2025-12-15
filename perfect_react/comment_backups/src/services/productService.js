// src/services/productService.js
import api from './api';

/**
 * productService
 * - getAllProducts(page, size, categoryId, searchTerm, sort, options)
 * - getProductById(id)
 * - createProduct(formData)
 * - updateProduct(id, formData)
 * - deleteProduct(id)
 * - getSalesCounts(productIds)  <-- NEW
 *
 * LƯU Ý: API endpoint sales assumed: GET /api/products/sales?ids=1,2,3
 * Nếu backend có khác, hãy chỉnh path/param trong getSalesCounts.
 */

export const productService = {
  getAllProducts: async (page = 0, size = 10, categoryId = null, searchTerm = null, sort = 'newest', options = {}) => {
    try {
      // convert sort to backend-friendly sortParam
      let sortParam = 'createdAt,desc';
      if (sort === 'hot') sortParam = 'hot';
      else if (sort === 'oldest') sortParam = 'createdAt,asc';
      // price sorting disabled in your backend -> leave default or log

      const params = {
        page,
        size,
        sort: sortParam
      };

      if (categoryId && categoryId !== 'all') params.categoryId = categoryId;
      if (searchTerm && typeof searchTerm === 'string' && searchTerm.trim() !== '') params.searchTerm = searchTerm.trim();

      // Optional: if backend supports includeSales param to return totalSold in same response
      // you can set options.includeSales = true when calling getAllProducts
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
      // If backend supports JSON updates, you can add handling here
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

  /**
   * NEW: getSalesCounts
   * - productIds: array of numeric productId
   * - returns array [{ productId, totalSold }, ...] or throws on error
   *
   * Assumes backend provides endpoint:
   *   GET /api/products/sales?ids=1,2,3
   *
   * If your backend uses a different path or request body, update here.
   */
  getSalesCounts: async (productIds = []) => {
    try {
      if (!Array.isArray(productIds) || productIds.length === 0) return [];

      // build query string: ids=1,2,3
      const idsParam = productIds.join(',');
      const response = await api.get('/api/products/sales', { params: { ids: idsParam } });

      // Expect response.data to be array of { productId, totalSold }
      return response.data;
    } catch (error) {
      console.warn('getSalesCounts failed:', error);
      // throw or return [] depending on how you want upstream to behave
      // return [] so frontend can continue with fallback values
      return [];
    }
  }
};

export default productService;
